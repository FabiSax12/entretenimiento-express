import type { Review } from "@/core/domain/entities";
import { StarRating } from "./StarRating";
import { Chip } from "@heroui/chip";
import { Card } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Calendar, Star } from "lucide-react";

interface ReviewCardProps {
  review: Review;
  serviceName?: string;
  showService?: boolean;
  className?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  serviceName,
  showService = true,
  className = ""
}) => {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'success';
    if (rating >= 4.0) return 'primary';
    if (rating >= 3.0) return 'warning';
    return 'danger';
  };

  return (
    <Card className={`p-6 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
      {/* Header de la reseña */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <Avatar />
          <div>
            <span className="font-semibold block mb-1">
              Cliente Verificado
            </span>
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} size="small" />
              <Chip
                variant="flat"
                color={getRatingColor(review.rating)}
                size="sm"
              >
                {review.rating}/5
              </Chip>
            </div>
          </div>
        </div>
        <div className="text-right">
          <Chip
            variant="bordered"
            color="default"
            size="sm"
            className="text-default-500"
            startContent={<Calendar size={16} />}
          >

            {formatDate(review.reviewedAt)}
          </Chip>
        </div>
      </div>

      {/* Chip del servicio */}
      {showService && serviceName && (
        <div className="mb-4">
          <Chip
            variant="flat"
            color="primary"
            size="md"
            className="gap-1"
          >
            <span>📋</span>
            {serviceName}
          </Chip>
        </div>
      )}

      {/* Contenido de la reseña */}
      <div className="text-gray-700 leading-relaxed mb-4">
        <p className="italic">&ldquo;{review.comment}&rdquo;</p>
      </div>

      {/* Footer con Chips informativos */}
      <div className="flex items-center justify-between gap-2">
        <Chip
          variant="dot"
          color="success"
          size="sm"
        >
          Compra verificada
        </Chip>

        <div className="flex gap-2">
          {/* Chip de calificación destacada */}
          {review.rating === 5 && (
            <Chip
              variant="shadow"
              color="warning"
              size="sm"
              startContent={<Star size={16} />}
            >
              Excelente
            </Chip>
          )}

          {/* Chip de reseña reciente */}
          {(() => {
            const daysDiff = Math.floor(
              (new Date().getTime() - new Date(review.reviewedAt).getTime()) / (1000 * 60 * 60 * 24)
            );
            return daysDiff <= 7 ? (
              <Chip
                variant="flat"
                color="success"
                size="sm"
              >
                <span>🔥</span>
                Reciente
              </Chip>
            ) : null;
          })()}
        </div>
      </div>
    </Card>
  );
};