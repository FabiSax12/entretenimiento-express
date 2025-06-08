import { Review } from "@/core/domain/entities";
import type { ReviewRepository } from "@/core/domain/repositories/ReviewRepository";
import reviewsJson from "@/core/infrastructure/data/Reviews.json";

export class InMemoryReviewRepository implements ReviewRepository {
  private reviews: Map<string, Review> = new Map();

  constructor() {
    reviewsJson.forEach(review => this.reviews.set(
      review.id,
      new Review(
        review.id,
        review.clientId,
        review.contractId,
        review.rating,
        review.comment,
        new Date(review.reviewedAt),
        review.isVisible,
        review.providerId,
        review.serviceId
      )
    ));
  }

  async getById(id: string): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async getAll(): Promise<Review[]> {
    return Array.from(this.reviews.values());
  }

  getByProviderId(providerId: string): Promise<Review[]> {
    const reviewsForProvider = Array.from(this.reviews.values()).filter(review => review.providerId === providerId);
    return Promise.resolve(reviewsForProvider);
  }

  async create(review: Review): Promise<Review> {
    this.reviews.set(review.id, review);
    return review;
  }

  async update(id: string, updates: Partial<Review>): Promise<Review | undefined> {
    const existingReview = this.reviews.get(id);
    if (!existingReview) return undefined;

    const updatedReview = { ...existingReview, ...updates };
    this.reviews.set(id, updatedReview);
    return updatedReview;
  }

  async delete(id: string): Promise<void> {
    this.reviews.delete(id);
  }
}