import type { Portfolio } from '@/core/domain/entities'
import { categoryRepository, portfolioRepository, serviceRepository } from '@/core/infrastructure/repositories/inMemory'
import { formatPrice } from '@/utils/formatPrice'
import { Card } from '@heroui/card'
import { Chip } from '@heroui/chip'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { SquareArrowOutUpRight } from 'lucide-react'
import { useMemo } from 'react'

export const Route = createFileRoute('/provider/$id/service/$serviceId')({
  component: RouteComponent,

  loader: async ({ context, params }) => {
    const { serviceId } = params

    return context.queryClient.ensureQueryData({
      queryKey: ['service', serviceId],
      queryFn: async () => serviceRepository.getById(serviceId),
      staleTime: 1000 * 60 * 5,
      retry: 1,
    })
  },
})

function RouteComponent() {

  const service = Route.useLoaderData()
  const params = Route.useParams()

  const {
    data: portfolio,
  } = useQuery<Portfolio>({
    queryKey: ['portfolio', service!.providerId],
    queryFn: () => portfolioRepository.getByProviderId(service!.providerId),
    enabled: service !== undefined,
  })

  const servicePortfolioItems = useMemo(() => {
    if (!portfolio || service === undefined) return [];
    return portfolio.items.filter(item => service.portfolioItems.includes(item.id));
  }, [portfolio, service?.portfolioItems]);

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryRepository.getAll(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })

  if (!service) {
    return <div className="text-center text-gray-500">Servicio no encontrado.</div>
  }

  return <div>
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">{service.name}</h3>
            <p className="text-gray-300 text-sm mb-3">{service.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Chip
              size="sm"
              className={
                service.isActive
                  ? "bg-green-900 text-green-300 border-green-700"
                  : "bg-red-900 text-red-300 border-red-700"
              }
            >
              {service.isActive ? "Activo" : "Inactivo"}
            </Chip>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-1">Categorías</h4>
            <div className="flex flex-wrap gap-1">
              {service.categories.map((categoryId) => (
                <Chip
                  key={categoryId}
                  size="sm"
                  variant="bordered"
                >
                  {categoriesQuery.data && categoriesQuery.data.find(cat => cat.id === categoryId)?.name || "Desconocida"}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-1">Precio</h4>
            <p className="text-white font-medium">
              {formatPrice(service.basePrice, service.priceType)}
            </p>
          </div>

          {service.portfolioItems.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">
                Ejemplos del Portafolio
              </h4>
              <div className="flex flex-wrap gap-1">
                {servicePortfolioItems.map((item) => (
                  <Link
                    to='/provider/$id/portfolio-item/$itemId'
                    params={{ id: params.id, itemId: item.id }}
                    key={item.id}
                  >
                    <Chip
                      size="sm"
                      color="secondary"
                      variant="flat"
                      endContent={<SquareArrowOutUpRight size={16} />}
                      className="flex gap-2 px-4"
                    >
                      {item.title}
                    </Chip>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t border-gray-700">
            <span className="text-xs text-gray-500">
              Creado: {new Date(service.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </Card>
    <Card>
      {/* <ReviewsSection
        reviews={service.}
        averageRating={averageRating}
        currentUser={currentUser}
        serviceId={service.id}
      /> */}
    </Card>
  </div>
}