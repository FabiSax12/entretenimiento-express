import { reviewRepository, serviceRepository } from "@/core/infrastructure/repositories/inMemory";
import { useQueries } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { ReviewsSection } from "./ReviewSection";
import { StarRating } from "./StarRating";
import { ReviewCard } from "./ReviewCard";
import { useMemo, useState } from "react";
import { ReviewFilters, type FilterOptions } from "./ReviewFilters";
import { ReviewStatsBadges } from "./ReviewStatsBadges";
import { useReviewStats } from "@/hooks/useReviewStats";
import { RatingDistribution } from "./RatingDistribution";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { BookOpen, Minus, Plus, Sheet, Star } from "lucide-react";

export const ProviderReviews = () => {
  const providerData = useLoaderData({ from: '/provider/$id/' });
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'newest'
  });

  // Obtener todas las reseñas
  const reviewQueries = useQueries({
    queries: providerData.reviews.map((reviewId) => ({
      queryKey: ['review', reviewId],
      queryFn: async () => reviewRepository.getById(reviewId)
    }))
  });

  // Obtener información de los servicios
  const serviceQueries = useQueries({
    queries: reviewQueries
      .filter(query => query.isSuccess && query.data?.serviceId)
      .map(query => ({
        queryKey: ['service', query.data?.serviceId],
        queryFn: async () => serviceRepository.getById(query.data?.serviceId!)
      }))
  });

  // Procesar reseñas
  const allReviews = useMemo(() => {
    return reviewQueries
      .filter(query => query.isSuccess && query.data?.isVisible)
      .map(query => query.data!);
  }, [reviewQueries]);

  // Filtrar y ordenar reseñas
  const filteredReviews = useMemo(() => {
    let filtered = [...allReviews];

    // Filtrar por calificación
    if (filters.rating) {
      filtered = filtered.filter(review => review.rating === filters.rating);
    }

    // Ordenar
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.reviewedAt).getTime() - new Date(b.reviewedAt).getTime());
        break;
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
    }

    return filtered;
  }, [allReviews, filters]);

  // Calcular estadísticas
  const stats = useReviewStats(allReviews);

  // Determinar qué reseñas mostrar
  const displayedReviews = showAllReviews
    ? filteredReviews
    : filteredReviews.slice(0, 6);

  // Función para obtener el nombre del servicio
  const getServiceName = (serviceId: string) => {
    const serviceQuery = serviceQueries.find(
      query => query.isSuccess && query.data?.id === serviceId
    );
    return serviceQuery?.data?.name || 'Servicio';
  };

  console.log('Provider Reviews Rendered', reviewQueries);

  if (reviewQueries.some(query => query.isLoading)) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">
          Reseñas y Calificaciones
        </h2>
        <p className="text-foreground/55">
          Opiniones de clientes sobre los servicios de {providerData.artisticName}
        </p>
      </div>

      {stats.totalReviews > 0 ? (
        <>
          {/* Badges de estadísticas */}
          <ReviewStatsBadges stats={stats} className="mb-6" />

          {/* Resumen de calificaciones */}
          <Card className="mb-8">
            <CardBody>
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Promedio general */}
                <div className="text-center lg:text-left">
                  <div className="flex flex-col lg:flex-row items-center gap-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold mb-2">
                        {stats.averageRating.toFixed(1)}
                      </div>
                      <StarRating rating={stats.averageRating} size="large" />
                      <p className="text-foreground/55 mt-2">
                        {stats.totalReviews} reseña{stats.totalReviews !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-center lg:text-left">
                      <p className="text-lg text-foreground/80 mb-2">
                        Calificación promedio
                      </p>
                      <p className="text-foreground/55">
                        Basada en {stats.totalReviews} opiniones verificadas
                      </p>
                      {stats.recentReviews > 0 && (
                        <p className="text-sm text-blue-600 mt-1">
                          {stats.recentReviews} reseñas en los últimos 30 días
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Distribución de calificaciones */}
                <RatingDistribution reviews={allReviews} />
              </div>
            </CardBody>
          </Card>

          {/* Filtros */}
          <ReviewFilters
            onFilterChange={setFilters}
            totalReviews={filteredReviews.length}
          />

          {/* Lista de reseñas */}
          <div className="space-y-6 mb-8">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <span>📝</span>
              Opiniones de clientes
              {filteredReviews.length !== stats.totalReviews && (
                <span className="text-sm font-normal text-gray-500">
                  ({filteredReviews.length} de {stats.totalReviews})
                </span>
              )}
            </h3>

            {filteredReviews.length > 0 ? (
              <div className="grid grid-cols-2 gap-6">
                {displayedReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 rounded-lg">
                <p className="text-foreground/55">
                  No se encontraron reseñas con los filtros seleccionados.
                </p>
              </div>
            )}
          </div>

          {/* Botón para mostrar más reseñas */}
          {filteredReviews.length > 6 && (
            <div className="text-center">
              <Button
                onPress={() => setShowAllReviews(!showAllReviews)}
                variant="flat"
                startContent={showAllReviews ? <Minus size={16} /> : <Plus size={16} />}
              >
                {showAllReviews ? "Mostrar menos reseñas" : `Ver todas las reseñas (${filteredReviews.length})`}
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card className="text-center py-16">
          <CardBody className="flex flex-col items-center">
            <Star className="mb-4 text-amber-300" size={50} />
            <h3 className="text-xl font-semibold mb-2">
              Sin reseñas aún
            </h3>
            <p className="text-foreground/55 mb-4">
              Este oferente aún no tiene reseñas en ninguno de sus servicios.
            </p>
            <p className="text-primary font-medium">
              ¡Sé el primero en dejar una reseña después de contratar este oferente!
            </p>
          </CardBody>
        </Card>
      )}

      {/* Nota informativa */}
      {/* <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-blue-600 text-lg">ℹ️</span>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Sobre las reseñas</p>
            <p>
              Todas las reseñas son de clientes verificados que han contratado servicios.
              Cada reseña está asociada a un servicio específico para mayor transparencia.
              Las estadísticas se actualizan en tiempo real.
            </p>
          </div>
        </div>
      </div> */}
    </section>
  );
};
