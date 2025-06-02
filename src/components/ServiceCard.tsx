import React, { use, useMemo } from "react";
import { SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Link } from "@tanstack/react-router";
import { Portfolio, Service } from "@/core/domain/entities";
import { formatPrice } from "@/utils/formatPrice";
import { categoryRepository, portfolioRepository } from "@/core/infrastructure/repositories/inMemory";
import { useQuery } from "@tanstack/react-query";

interface ServiceCardProps {
  service: Service;
  onEdit: (serviceId: string) => void;
  onDelete: (serviceId: string) => void;
}
export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onEdit,
  onDelete
}) => {

  const categoriesPromise = useMemo(() => categoryRepository.getAll(), [])
  const categories = use(categoriesPromise);

  const {
    data: portfolio,
  } = useQuery<Portfolio>({
    queryKey: ['portfolio', service.providerId],
    queryFn: () => portfolioRepository.getByProviderId(service.providerId),
  })

  const servicePortfolioItems = useMemo(() => {
    if (!portfolio) return [];
    return portfolio.items.filter(item => service.portfolioItems.includes(item.id));
  }, [portfolio, service.portfolioItems]);

  return (
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
                  {categories.find(cat => cat.id === categoryId)?.name || "Desconocida"}
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
                    to='/provider/portfolio-item/$id'
                    params={{ id: item.id }}
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
            <div className="flex gap-2">
              <Button
                variant="light"
                size="sm"
                onPress={() => onEdit(service.id)}
              >
                Editar
              </Button>
              <Button
                color="danger"
                variant="light"
                size="sm"
                onPress={() => onDelete(service.id)}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};