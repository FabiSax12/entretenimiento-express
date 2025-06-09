import { useMemo } from 'react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewedAt: Date | string;
  serviceId?: string;
  isVisible: boolean;
}

export const useReviewStats = (reviews: Review[]) => {
  return useMemo(() => {
    const visibleReviews = reviews.filter(r => r.isVisible);

    const averageRating = visibleReviews.length > 0
      ? visibleReviews.reduce((acc, review) => acc + review.rating, 0) / visibleReviews.length
      : 0;

    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
      const count = visibleReviews.filter(r => r.rating === rating).length;
      const percentage = visibleReviews.length > 0 ? (count / visibleReviews.length) * 100 : 0;
      return { rating, count, percentage };
    });

    const mostFrequentRating = ratingDistribution.reduce((max, curr) =>
      curr.count > max.count ? curr : max
    );

    const uniqueServices = new Set(visibleReviews.map(r => r.serviceId).filter(Boolean)).size;

    // Análisis temporal (últimos 30 días)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentReviews = visibleReviews.filter(review =>
      new Date(review.reviewedAt) >= thirtyDaysAgo
    );

    return {
      totalReviews: visibleReviews.length,
      averageRating,
      ratingDistribution,
      mostFrequentRating,
      uniqueServices,
      recentReviews: recentReviews.length,
      reviewQuality: averageRating >= 4.5 ? 'excellent' :
        averageRating >= 4.0 ? 'very-good' :
          averageRating >= 3.5 ? 'good' :
            averageRating >= 3.0 ? 'fair' : 'poor'
    };
  }, [reviews]);
};