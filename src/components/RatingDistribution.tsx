import React from 'react';

interface RatingDistributionProps {
  reviews: Array<{ rating: number }>;
  className?: string;
}

export const RatingDistribution: React.FC<RatingDistributionProps> = ({
  reviews,
  className = ""
}) => {
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(r => r.rating === rating).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { rating, count, percentage };
  });

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="font-semibold text-gray-900 mb-4">
        Distribución de calificaciones
      </h3>
      {ratingDistribution.map(({ rating, count, percentage }) => (
        <div key={rating} className="flex items-center gap-3">
          <span className="w-8 text-sm text-gray-600 font-medium">
            {rating} ★
          </span>
          <div className="flex-1 bg-default-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="w-12 text-sm text-foreground/50 text-right">
            ({count})
          </span>
        </div>
      ))}
    </div>
  );
};