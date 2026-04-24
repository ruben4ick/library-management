import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import {
  register as registerService,
  login as loginService,
  refresh as refreshService,
  requestPasswordReset as requestPasswordResetService,
  AuthError,
} from "../services/auth.service";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
} from "../schemas/auth.schema";
import prisma from "../db/prisma";
import CONFIG from "../config";

interface ResetPasswordPayload extends jwt.JwtPayload {
  email: string;
}

export async function register(req: Request, res: Response) {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ message: "Validation error", errors: result.error.issues });
  }

  try {
    const data = await registerService(result.data);
    res.status(201).json(data);
  } catch (err) {
    if (err instanceof AuthError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req: Request, res: Response) {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ message: "Validation error", errors: result.error.issues });
  }

  try {
    const data = await loginService(result.data);
    res.status(200).json(data);
  } catch (err) {
    if (err instanceof AuthError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function refresh(req: Request, res: Response) {
  const result = refreshSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ message: "Validation error", errors: result.error.issues });
  }

  try {
    const data = await refreshService(result.data.refreshToken);
    res.status(200).json(data);
  } catch (err) {
    if (err instanceof AuthError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function requestPasswordReset(req: Request, res: Response) {
  const result = requestPasswordResetSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ message: "Validation error", errors: result.error.issues });
  }

  try {
    await requestPasswordResetService(result.data.email);
  } catch {
    // Swallow errors to avoid leaking whether email exists
  }

  res.status(200).json({
    message: "Message sent successfully",
  });
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = resetPasswordSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ message: "Validation error", errors: result.error.issues });
  }

  const { token, password } = result.data;

  jwt.verify(token, CONFIG.jwtSecret, async (err, decoded) => {
    if (err) {
      if (err.name === "JsonWebTokenError") {
        return res.status(400).json({ message: "Token is not valid" });
      }

      if (err.name === "TokenExpiredError") {
        return res.status(400).json({ message: "Token is expired" });
      }

      return next(err);
    }

    const email = (decoded as ResetPasswordPayload).email;

    try {
      const hashedPassword = await bcrypt.hash(password, 12);

      await prisma.user.update({
        where: { email },
        data: { passwordHash: hashedPassword },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }

    res.status(200).json({ message: "Password successfully updated" });
  });
}
