import prisma from '../db/prisma';

const userWithoutPassword = {
  id: true,
  name: true,
  email: true,
  role: true,
} as const;

export async function findAllUsers() {
  return prisma.user.findMany({ select: userWithoutPassword });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: userWithoutPassword,
  });
}

export async function findByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}
