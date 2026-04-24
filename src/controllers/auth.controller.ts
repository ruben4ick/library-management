import { Request, Response } from "express";
import {
  register as registerService,
  login as loginService,
  refresh as refreshService,
  requestPasswordReset as requestPasswordResetService,
  resetPassword as resetPasswordService,
  AuthError,
} from "../services/auth.service";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
} from "../schemas/auth.schema";

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
    message:
      "Якщо вказаний email зареєстрований, лист з інструкціями надіслано.",
  });
}

export async function resetPassword(req: Request, res: Response) {
  const result = resetPasswordSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ message: "Validation error", errors: result.error.issues });
  }

  try {
    await resetPasswordService(result.data.token, result.data.password);
    res.status(200).json({ message: "Пароль успішно змінено." });
  } catch (err) {
    if (err instanceof AuthError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}
