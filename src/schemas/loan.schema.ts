import { z } from "zod";

export const createLoanSchema = z.object({
  bookId: z.string().min(1, "Book ID is required"),
});
