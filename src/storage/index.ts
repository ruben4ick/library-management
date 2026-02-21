import { Book, Loan, User } from "../types";
import { FileBackedMap } from "./file-backed-map";

function reviveLoan(value: unknown): Loan {
  const v = value as Loan;
  return {
    ...v,
    loanDate: new Date(v.loanDate),
    returnDate: v.returnDate ? new Date(v.returnDate) : null,
  };
}

export const books = new FileBackedMap<Book>("books.json");
export const users = new FileBackedMap<User>("users.json");
export const loans = new FileBackedMap<Loan>("loans.json", reviveLoan);
