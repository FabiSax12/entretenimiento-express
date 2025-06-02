import React from "react";
import { SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Link } from "@tanstack/react-router";
import { Service } from "@/core/domain/entities";
import { formatPrice } from "@/utils/formatPrice";
import { QueryClient } from "@tanstack/react-query";

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
  const qc = new QueryClient();
  const portfolioItems = qc.getQueryData<string[]>(['portfolioItems', service.id]) || [];

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
              {service.categories.map((category, index) => (
                <Chip
                  key={index}
                  size="sm"
                  variant="bordered"
                >
                  {category}
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
                {service.portfolioItems.map((itemId) => (
                  <Link
                    to='/provider/portfolio-item/$id'
                    params={{ id: itemId }}
                    key={itemId}
                  >
                    <Chip
                      size="sm"
                      color="secondary"
                      variant="flat"
                      endContent={<SquareArrowOutUpRight size={16} />}
                      className="flex gap-2 px-4"
                    >
                      {itemId}
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