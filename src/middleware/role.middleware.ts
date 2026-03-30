import type { Request, Response, NextFunction } from "express";
import type { RequestWithUser } from "./auth.middleware";
import type { UserRole } from "../types";

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as RequestWithUser).user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
}
