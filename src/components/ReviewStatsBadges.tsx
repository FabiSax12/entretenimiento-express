import React from 'react';
import { Chip, type ChipProps } from "@heroui/chip";
import { BarChart2, Clock, Goal, Star, Trophy } from 'lucide-react';

interface ReviewStatsBadgesProps {
  stats: {
    totalReviews: number;
    averageRating: number;
    uniqueServices: number;
    recentReviews: number;
    reviewQuality: string;
  };
  className?: string;
}

export const ReviewStatsBadges: React.FC<ReviewStatsBadgesProps> = ({
  stats,
  className = ""
}) => {
  const getQualityColor = (quality: string): ChipProps["color"] => {
    switch (quality) {
      case 'excellent': return 'success';
      case 'very-good': return 'primary';
      case 'good': return 'secondary';
      case 'fair': return 'warning';
      default: return 'danger';
    }
  };

  const getQualityText = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'Excelente';
      case 'very-good': return 'Muy Bueno';
      case 'good': return 'Bueno';
      case 'fair': return 'Regular';
      default: return 'Necesita Mejorar';
    }
  };

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {/* Badge de calidad general */}
      <Chip className='px-3' startContent={<Trophy size={16} />} color={getQualityColor(stats.reviewQuality)}>
        Calidad: {getQualityText(stats.reviewQuality)}
      </Chip>

      {/* Badge de total de reseñas */}
      <Chip className='px-3' startContent={<BarChart2 size={16} />} color='secondary'>
        {stats.totalReviews} reseñas totales
      </Chip>

      {/* Badge de servicios evaluados */}
      <Chip className='px-3' startContent={<Goal size={16} />} color='primary'>
        {stats.uniqueServices} servicios evaluados
      </Chip>

      {/* Badge de reseñas recientes */}
      {stats.recentReviews > 0 && (
        <Chip className='px-3' startContent={<Clock size={16} />} color='default'>
          {stats.recentReviews} en últimos 30 días
        </Chip>
      )}

      {/* Badge de promedio */}
      <Chip className='px-3' startContent={<Star size={16} />} color='warning'>
        Promedio: {stats.averageRating.toFixed(1)}
      </Chip>
    </div>
  );
};