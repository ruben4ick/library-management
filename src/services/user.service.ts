import { randomUUID } from 'crypto';
import { users } from '../storage';
import { User } from '../types';
import { CreateUserDto } from '../schemas/user.schema';

export function findAllUsers(): User[] {
  return Array.from(users.values());
}

export function findUserById(id: string): User | undefined {
  return users.get(id);
}

export function createUser(dto: CreateUserDto): User {
  const user: User = { id: randomUUID(), ...dto };
  users.set(user.id, user);
  return user;
}
