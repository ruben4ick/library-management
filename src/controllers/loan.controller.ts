import { Request, Response } from "express";
import {
  findAllLoans,
  createLoan as createLoanService,
  returnLoan as returnLoanService,
  LoanError,
} from "../services/loan.service";
import { createLoanSchema } from "../schemas/loan.schema";

export function getAllLoans(req: Request, res: Response) {
  res.json(findAllLoans());
}

export function createLoan(req: Request, res: Response) {
  const result = createLoanSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ message: "Validation error", errors: result.error.issues });
  }
  try {
    res.status(201).json(createLoanService(result.data));
  } catch (err) {
    if (err instanceof LoanError) {
      res.status(422).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export function returnLoan(req: Request, res: Response) {
  try {
    res.json(returnLoanService(String(req.params.id)));
  } catch (err) {
    if (err instanceof LoanError) {
      res.status(422).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
