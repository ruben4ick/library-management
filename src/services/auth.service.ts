import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import prisma from '../db/prisma';
import CONFIG from '../config';
import type { RegisterDto, LoginDto } from '../schemas/auth.schema';
import type { JwtPayload } from '../types';

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, CONFIG.jwtSecret, {
    expiresIn: CONFIG.jwtExpiresIn as StringValue,
  });
}

async function generateRefreshToken(userId: string): Promise<string> {
  const token = randomUUID();

  const expiresAt = new Date();
  const days = parseInt(CONFIG.refreshTokenExpiresIn);
  expiresAt.setDate(expiresAt.getDate() + (isNaN(days) ? 7 : days));

  await prisma.refreshToken.create({
    data: { userId, token, expiresAt },
  });

  return token;
}

export async function register(dto: RegisterDto) {
  const existing = await prisma.user.findUnique({ where: { email: dto.email } });
  if (existing) throw new AuthError('Email already exists', 409);

  const passwordHash = await bcrypt.hash(dto.password, 12);

  const user = await prisma.user.create({
    data: {
      name: dto.name,
      email: dto.email,
      passwordHash,
    },
  });

  const tokenPayload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const token = generateAccessToken(tokenPayload);
  const refreshToken = await generateRefreshToken(user.id);

  return {
    token,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}

export async function login(dto: LoginDto) {
  const user = await prisma.user.findUnique({ where: { email: dto.email } });
  if (!user) throw new AuthError('Invalid email or password', 401);

  const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
  if (!isPasswordValid) throw new AuthError('Invalid email or password', 401);

  const tokenPayload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const token = generateAccessToken(tokenPayload);
  const refreshToken = await generateRefreshToken(user.id);

  return {
    token,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}

export async function refresh(refreshTokenValue: string) {
  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshTokenValue },
    include: { user: true },
  });

  if (!stored) throw new AuthError('Invalid refresh token', 401);
  if (stored.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { id: stored.id } });
    throw new AuthError('Refresh token expired', 401);
  }

  await prisma.refreshToken.delete({ where: { id: stored.id } });

  const tokenPayload: JwtPayload = {
    userId: stored.user.id,
    email: stored.user.email,
    role: stored.user.role,
  };

  const token = generateAccessToken(tokenPayload);
  const newRefreshToken = await generateRefreshToken(stored.user.id);

  return {
    token,
    refreshToken: newRefreshToken,
    user: {
      id: stored.user.id,
      email: stored.user.email,
      name: stored.user.name,
      role: stored.user.role,
    },
  };
}
