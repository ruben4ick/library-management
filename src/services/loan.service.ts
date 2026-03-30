import prisma from "../db/prisma";

export class LoanError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LoanError";
  }
}

export async function findAllLoans() {
  return prisma.loan.findMany();
}

export async function findLoansByUserId(userId: string) {
  return prisma.loan.findMany({ where: { userId } });
}

export async function createLoan(userId: string, bookId: string) {
  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) throw new LoanError("Book not found");
  if (!book.available) throw new LoanError("Book is not available");

  const activeLoan = await prisma.loan.findFirst({
    where: { bookId, status: "ACTIVE" },
  });
  if (activeLoan) throw new LoanError("Book already has an active loan");

  return prisma.$transaction(async (tx) => {
    const loan = await tx.loan.create({
      data: { userId, bookId },
    });

    await tx.book.update({
      where: { id: bookId },
      data: { available: false },
    });

    return loan;
  });
}

export async function returnLoan(id: string) {
  const loan = await prisma.loan.findUnique({ where: { id } });
  if (!loan) throw new LoanError("Loan not found");
  if (loan.status === "RETURNED") throw new LoanError("Loan already returned");

  return prisma.$transaction(async (tx) => {
    const returned = await tx.loan.update({
      where: { id },
      data: { status: "RETURNED", returnDate: new Date() },
    });

    await tx.book.update({
      where: { id: loan.bookId },
      data: { available: true },
    });

    return returned;
  });
}
