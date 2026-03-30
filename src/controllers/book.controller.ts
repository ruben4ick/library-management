import { Request, Response } from 'express';
import {
  findAllBooks,
  findBookById,
  createBook as createBookService,
  updateBook as updateBookService,
  removeBook,
} from '../services/book.service';
import { createBookSchema, updateBookSchema } from '../schemas/book.schema';

export async function getAllBooks(req: Request, res: Response) {
  res.json(await findAllBooks());
}

export async function getBookById(req: Request, res: Response) {
  const book = await findBookById(String(req.params.id));
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  res.json(book);
}

export async function createBook(req: Request, res: Response) {
  const result = createBookSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: 'Validation error', errors: result.error.issues });
  }
  res.status(201).json(await createBookService(result.data));
}

export async function updateBook(req: Request, res: Response) {
  const result = updateBookSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: 'Validation error', errors: result.error.issues });
  }
  const book = await updateBookService(String(req.params.id), result.data);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  res.json(book);
}

export async function deleteBook(req: Request, res: Response) {
  const deleted = await removeBook(String(req.params.id));
  if (!deleted) {
    return res.status(404).json({ message: 'Book not found' });
  }
  res.status(204).send();
}
