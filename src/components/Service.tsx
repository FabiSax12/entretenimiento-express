import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@heroui/button";
import { Provider } from "@/core/domain/entities";
import { ServiceCard } from "./ServiceCard";
import { EmptyServicesState } from "./EmptyServicesState";
import { useQuery } from "@tanstack/react-query";
import { serviceRepository } from "@/core/infrastructure/repositories/inMemory";

interface ServicesProps {
  providerData: Provider;
  onAddService: () => void;
  onEditService: (serviceId: string) => void;
  onDeleteService: (serviceId: string) => void;
}

export const Services: React.FC<ServicesProps> = ({
  providerData,
  onAddService,
  onEditService,
  onDeleteService
}) => {
  const {
    data: services,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['services', providerData.id],
    queryFn: async () => serviceRepository.getByProviderId(providerData.id),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Mis Servicios</h2>
        <Button
          color="primary"
          variant="bordered"
          startContent={<Plus className="h-4 w-4" />}
          onPress={onAddService}
        >
          Añadir Servicio
        </Button>
      </div>

      {isLoading && <div className="text-center text-gray-500">Cargando servicios...</div>}
      {isError && <div className="text-center text-red-500">Error al cargar los servicios.</div>}

      {services && services.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={onEditService}
              onDelete={onDeleteService}
            />
          ))}
        </div>
      ) : (
        <EmptyServicesState onCreateService={onAddService} />
      )}
    </div>
  );
};