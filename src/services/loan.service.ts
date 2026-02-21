import { randomUUID } from 'crypto';
import { loans, books } from '../storage';
import { Loan } from '../types';
import { CreateLoanDto } from '../schemas/loan.schema';

export class LoanError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LoanError';
  }
}

export function findAllLoans(): Loan[] {
  return Array.from(loans.values());
}

export function createLoan(dto: CreateLoanDto): Loan {
  const book = books.get(dto.bookId);
  if (!book) throw new LoanError('Book not found');
  if (!book.available) throw new LoanError('Book is not available');

  const activeLoan = Array.from(loans.values()).find(
    (l) => l.bookId === dto.bookId && l.status === 'ACTIVE'
  );
  if (activeLoan) throw new LoanError('Book already has an active loan');

  const loan: Loan = {
    id: randomUUID(),
    userId: dto.userId,
    bookId: dto.bookId,
    loanDate: new Date(),
    returnDate: null,
    status: 'ACTIVE',
  };

  loans.set(loan.id, loan);
  books.set(book.id, { ...book, available: false });

  return loan;
}

export function returnLoan(id: string): Loan {
  const loan = loans.get(id);
  if (!loan) throw new LoanError('Loan not found');
  if (loan.status === 'RETURNED') throw new LoanError('Loan already returned');

  const returned: Loan = { ...loan, status: 'RETURNED', returnDate: new Date() };
  loans.set(id, returned);

  const book = books.get(loan.bookId);
  if (book) books.set(book.id, { ...book, available: true });

  return returned;
}
