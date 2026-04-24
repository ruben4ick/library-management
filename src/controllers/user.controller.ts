import * as fs from "node:fs/promises";
import path from "node:path";

import { Request, Response } from "express";

import { findAllUsers, findUserById } from "../services/user.service";
import prisma from "../db/prisma";
import type { JwtPayload } from "../types";

export async function getAllUsers(req: Request, res: Response) {
  res.json(await findAllUsers());
}

export async function getUserById(req: Request, res: Response) {
  const user = await findUserById(String(req.params.id));
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
}

export async function getMe(req: Request, res: Response) {
  const { userId } = (req as any).user as JwtPayload;
  const user = await findUserById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
}

export async function uploadAvatar(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ message: "Avatar file is required" });
  }

  const { userId } = (req as any).user as JwtPayload;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.avatarUrl !== null) {
    const oldPath = path.resolve(user.avatarUrl.replace(/^\//, ""));
    try {
      await fs.unlink(oldPath);
    } catch {
      // Old file may already be missing
    }
  }

  const avatarUrl = `/uploads/avatars/${req.file.filename}`;

  await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl },
  });

  res.json({ message: "Аватарку успішно оновлено.", avatarUrl });
}

export async function deleteAvatar(req: Request, res: Response) {
  const { userId } = (req as any).user as JwtPayload;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.avatarUrl === null) {
    return res.status(404).json({ message: "Avatar not found" });
  }

  const filePath = path.resolve(user.avatarUrl.replace(/^\//, ""));
  try {
    await fs.unlink(filePath);
  } catch {
    // File may already be missing
  }

  await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: null },
  });

  res.json({ message: "Аватарку видалено." });
}
