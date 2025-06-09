import type { Review } from "../entities";

export interface ReviewRepository {
  getAll(): Promise<Review[]>;
  getById(id: string): Promise<Review | undefined>;
  getByProviderId(providerId: string): Promise<Review[]>;
  create(review: Review): Promise<Review>;
  update(id: string, updates: Partial<Review>): Promise<Review | undefined>;
  delete(id: string): Promise<void>;
}