import { Card } from '@heroui/card';
import { Select, SelectItem } from '@heroui/select';
import React, { useState } from 'react';

interface ReviewFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  totalReviews: number;
  className?: string;
}

export interface FilterOptions {
  rating?: number;
  sortBy: 'newest' | 'oldest' | 'highest' | 'lowest';
  serviceId?: string;
}

export const ReviewFilters: React.FC<ReviewFiltersProps> = ({
  onFilterChange,
  totalReviews,
  className = ""
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'newest'
  });

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <Card className={`p-4 mb-6 ${className}`}>
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground/80">Filtrar por:</span>
        </div>

        <div className='flex gap-4 flex-1'>
          {/* Filtro por calificación */}
          <Select
            value={filters.rating || ''}
            onChange={(e) => handleFilterChange({
              rating: e.target.value ? parseInt(e.target.value) : undefined
            })}
            variant='bordered'
          >
            <SelectItem key="">Todas las calificaciones</SelectItem>
            <SelectItem key="5">5 estrellas</SelectItem>
            <SelectItem key="4">4 estrellas</SelectItem>
            <SelectItem key="3">3 estrellas</SelectItem>
            <SelectItem key="2">2 estrellas</SelectItem>
            <SelectItem key="1">1 estrella</SelectItem>
          </Select>

          {/* Ordenar por */}
          <Select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange({
              sortBy: e.target.value as FilterOptions['sortBy']
            })}
            variant='bordered'
          >
            <SelectItem key="newest">Más recientes</SelectItem>
            <SelectItem key="oldest">Más antiguas</SelectItem>
            <SelectItem key="highest">Calificación más alta</SelectItem>
            <SelectItem key="lowest">Calificación más baja</SelectItem>
          </Select>
        </div>
        <div className="ml-auto text-sm text-gray-600">
          {totalReviews} reseña{totalReviews !== 1 ? 's' : ''} encontrada{totalReviews !== 1 ? 's' : ''}
        </div>
      </div>
    </Card>
  );
};