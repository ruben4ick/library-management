import { randomUUID } from 'crypto';
import { books } from '../storage';
import { Book } from '../types';
import { CreateBookDto, UpdateBookDto } from '../schemas/book.schema';

export function findAllBooks(): Book[] {
  return Array.from(books.values());
}

export function findBookById(id: string): Book | undefined {
  return books.get(id);
}

export function createBook(dto: CreateBookDto): Book {
  const book: Book = { id: randomUUID(), available: true, ...dto };
  books.set(book.id, book);
  return book;
}

export function updateBook(id: string, dto: UpdateBookDto): Book | undefined {
  const book = books.get(id);
  if (!book) return undefined;

  const updated = { ...book, ...dto };
  books.set(id, updated);
  return updated;
}

export function removeBook(id: string): boolean {
  return books.delete(id);
}
