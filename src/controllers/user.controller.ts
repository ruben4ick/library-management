import { Request, Response } from 'express';
import { findAllUsers, findUserById, createUser as createUserService } from '../services/user.service';
import { createUserSchema } from '../schemas/user.schema';

export function getAllUsers(req: Request, res: Response) {
  res.json(findAllUsers());
}

export function getUserById(req: Request, res: Response) {
  const user = findUserById(String(req.params.id));
  if (!user) {
      return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
}

export function createUser(req: Request, res: Response) {
  const result = createUserSchema.safeParse(req.body);
  if (!result.success) {
      return res.status(400).json({ message: 'Validation error', errors: result.error.issues });
  }
  res.status(201).json(createUserService(result.data));
}
