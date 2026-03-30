import prisma from "../db/prisma";
import type { CreateBookDto, UpdateBookDto } from "../schemas/book.schema";

export async function findAllBooks() {
  return prisma.book.findMany();
}

export async function findBookById(id: string) {
  return prisma.book.findUnique({ where: { id } });
}

export async function createBook(dto: CreateBookDto) {
  return prisma.book.create({ data: dto });
}

export async function updateBook(id: string, dto: UpdateBookDto) {
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) return null;

  return prisma.book.update({ where: { id }, data: dto });
}

export async function removeBook(id: string) {
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) return false;

  await prisma.book.delete({ where: { id } });
  return true;
}
