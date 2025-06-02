import type { Review } from "@/core/domain/entities";

export interface IReviewService {
  createReview(review: Review): Promise<Review>;
  getByProvider(providerId: string): Promise<Review[]>;
  getByContract(contractId: string): Promise<Review | undefined>;
  updateVisibility(reviewId: string, isVisible: boolean): Promise<Review | undefined>;
}