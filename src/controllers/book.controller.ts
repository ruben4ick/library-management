import { Request, Response } from "express";
import {
  findAllBooks,
  findBookById,
  createBook as createBookService,
  updateBook as updateBookService,
  removeBook,
} from "../services/book.service";
import { createBookSchema, updateBookSchema } from "../schemas/book.schema";

export function getAllBooks(req: Request, res: Response): void {
  res.json(findAllBooks());
}

export function getBookById(req: Request, res: Response): void {
  const book = findBookById(String(req.params.id));
  if (!book) {
    res.status(404).json({ message: "Book not found" });
    return;
  }
  res.json(book);
}

export function createBook(req: Request, res: Response) {
  const result = createBookSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ message: "Validation error", errors: result.error.issues });
  }
  res.status(201).json(createBookService(result.data));
}

export function updateBook(req: Request, res: Response) {
  const result = updateBookSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ message: "Validation error", errors: result.error.issues });
  }
  const book = updateBookService(String(req.params.id), result.data);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.json(book);
}

export function deleteBook(req: Request, res: Response) {
  const deleted = removeBook(String(req.params.id));
  if (!deleted) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.status(204).send();
}
