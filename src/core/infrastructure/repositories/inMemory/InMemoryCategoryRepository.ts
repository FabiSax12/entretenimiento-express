import type { CategoryRepository } from "@/core/domain/repositories/CategoryRepository";
import { Category } from "@/core/domain/entities/Category";
import { MethodNotImplementedException } from "@/core/domain/exceptions/MethodNotImplemented";
import categoriesJson from "@/core/infrastructure/data/Categories.json";

export class InMemoryCategoryRepository implements CategoryRepository {
  private categories: Map<string, Category> = new Map();

  constructor() {
    categoriesJson.forEach((categoryData: any) => {
      const category = new Category(
        categoryData.id,
        categoryData.name,
      );
      this.categories.set(category.id, category);
    })
  }

  async getAll(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getById(categoryId: string): Promise<Category | undefined> {
    return this.categories.get(categoryId);
  }

  async create(): Promise<Category> {
    throw new MethodNotImplementedException("Create")
  }

  async update(): Promise<Category | undefined> {
    throw new MethodNotImplementedException("Update")
  }

  async delete(categoryId: string): Promise<void> {
    if (!this.categories.has(categoryId)) {
      throw new Error(`Category with ID ${categoryId} does not exist.`);
    }
    this.categories.delete(categoryId);
  }
}