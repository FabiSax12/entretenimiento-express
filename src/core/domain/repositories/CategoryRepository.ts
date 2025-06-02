import type { Category } from "../entities/Category";

export interface CategoryRepository {
  getAll(): Promise<Category[]>;
  getById(categoryId: string): Promise<Category | undefined>;
  create(category: string): Promise<Category>;
  update(categoryId: string, category: string): Promise<Category | undefined>;
  delete(categoryId: string): Promise<void>;
}