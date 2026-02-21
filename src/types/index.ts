export type Book = {
  id: string;
  title: string;
  author: string;
  year: number;
  isbn: string;
  available: boolean;
}

export type User = {
  id: string;
  name: string;
  email: string;
}

export type LoanStatus = 'ACTIVE' | 'RETURNED';

export type Loan = {
  id: string;
  userId: string;
  bookId: string;
  loanDate: Date;
  returnDate: Date | null;
  status: LoanStatus;
}
