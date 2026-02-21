import { z } from 'zod';

export const createBookSchema = z.object({
  title: z
      .string()
      .min(1, 'Title is required')
      .max(100, 'Title must be less than 100 characters'),
  author: z
      .string()
      .min(1, 'Author is required')
      .max(50, 'Author must be less than 50 characters'),
  year: z.number().int().min(1000).max(new Date().getFullYear()),
  isbn: z.string().min(1),
});

export const updateBookSchema = createBookSchema.partial();

export type CreateBookDto = z.infer<typeof createBookSchema>;
export type UpdateBookDto = z.infer<typeof updateBookSchema>;
