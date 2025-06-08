import { useState } from "react";
import { StarRating } from "./StarRating";
import type { Review, User } from "@/core/domain/entities";
import { ReviewCard } from "./ReviewCard";

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number;
  currentUser: User | null;
  serviceId: string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  averageRating,
  currentUser,
  serviceId
}) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0
      ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
      : 0
  }));

  return (
    <section className="reviews-section">
      <h2>Reseñas y Calificaciones</h2>

      {reviews.length > 0 ? (
        <>
          {/* Resumen de calificaciones */}
          <div className="rating-overview">
            <div className="rating-summary-large">
              <div className="average-rating">
                <span className="rating-number-large">{averageRating.toFixed(1)}</span>
                <StarRating rating={averageRating} size="large" />
                <p>{reviews.length} reseña{reviews.length !== 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="rating-distribution">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="rating-bar">
                  <span className="rating-label">{rating} ★</span>
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="rating-count">({count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lista de reseñas */}
          <div className="reviews-list">
            {displayedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {reviews.length > 3 && (
            <div className="reviews-actions">
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="btn btn-outline"
              >
                {showAllReviews
                  ? 'Mostrar menos reseñas'
                  : `Ver todas las reseñas (${reviews.length})`
                }
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="no-reviews">
          <p>Este servicio aún no tiene reseñas.</p>
          {currentUser?.role === 'Client' && (
            <p>¡Sé el primero en dejar una reseña después de contratar este servicio!</p>
          )}
        </div>
      )}
    </section>
  );
};