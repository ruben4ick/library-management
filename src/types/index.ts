export type { Book } from "./book";
export type { User, UserRole } from "./user";
export type { Loan, LoanStatus } from "./loan";

export type JwtPayload = {
  userId: string;
  email: string;
  role: "USER" | "ADMIN";
};
