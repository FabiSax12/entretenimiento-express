import { User } from "@/core/domain/entities";
import type { UserRepository } from "@/core/domain/repositories/UserRepository";
import usersJson from "@/core/infrastructure/data/users.json";

export default class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  constructor() {
    usersJson.forEach(userData => {
      this.users.push(new User(
        userData.id,
        userData.email,
        userData.password,
        userData.role as User['role'],
        userData.createdAt ? new Date(userData.createdAt) : new Date(),
        userData.updatedAt ? new Date(userData.updatedAt) : new Date()
      ));
    });
  }

  async getAll(): Promise<User[]> {
    return this.users;
  }

  getUserById(id: string): Promise<User | undefined> {
    const user = this.users.find(user => user.id === id);
    return Promise.resolve(user);
  }

  getUserByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find(user => user.email === email);
    return Promise.resolve(user);
  }

  create(user: User): Promise<User> {
    this.users.push(user);
    return Promise.resolve(user);
  }

  update(id: string, updates: Partial<User>): Promise<User | undefined> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return Promise.resolve(undefined);
    }

    const updatedUser = { ...this.users[userIndex], ...updates };
    this.users[userIndex] = updatedUser;
    return Promise.resolve(updatedUser);
  }

  delete(id: string): Promise<void> {
    this.users = this.users.filter(user => user.id !== id);
    return Promise.resolve();
  }
}