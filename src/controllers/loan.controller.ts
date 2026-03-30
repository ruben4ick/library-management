import { Request, Response } from 'express';
import {
  findAllLoans,
  findLoansByUserId,
  createLoan as createLoanService,
  returnLoan as returnLoanService,
  LoanError,
} from '../services/loan.service';
import { createLoanSchema } from '../schemas/loan.schema';
import type { JwtPayload } from '../types';

export async function getAllLoans(req: Request, res: Response) {
  const user = (req as any).user as JwtPayload;

  if (user.role === 'ADMIN') {
    res.json(await findAllLoans());
  } else {
    res.json(await findLoansByUserId(user.userId));
  }
}

export async function createLoan(req: Request, res: Response) {
  const result = createLoanSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: 'Validation error', errors: result.error.issues });
  }

  const user = (req as any).user as JwtPayload;

  try {
    const loan = await createLoanService(user.userId, result.data.bookId);
    res.status(201).json(loan);
  } catch (err) {
    if (err instanceof LoanError) {
      return res.status(422).json({ message: err.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function returnLoan(req: Request, res: Response) {
  try {
    const loan = await returnLoanService(String(req.params.id));
    res.json(loan);
  } catch (err) {
    if (err instanceof LoanError) {
      return res.status(422).json({ message: err.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}
