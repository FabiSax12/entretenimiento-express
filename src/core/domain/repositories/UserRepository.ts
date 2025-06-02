import type { User } from "../entities";

export interface UserRepository {
  getAll(): Promise<User[]>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  create(user: User): Promise<User>;
  update(id: string, updates: Partial<User>): Promise<User | undefined>;
  delete(id: string): Promise<void>;
}