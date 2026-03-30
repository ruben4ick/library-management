import { Request, Response } from "express";
import { findAllUsers, findUserById } from "../services/user.service";
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
