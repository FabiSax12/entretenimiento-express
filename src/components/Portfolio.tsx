import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@heroui/button";
import { Provider } from "@/core/domain/entities";
import { PortfolioItem } from "./PortfolioItem";
import { useQuery } from "@tanstack/react-query";
import { portfolioRepository } from "@/core/infrastructure/repositories/inMemory";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuthStore } from "@/stores/authStore";

interface PortfolioProps {
  providerData: Provider;
  onAddItem: () => void;
  onEditItem: (itemId: string) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({
  providerData,
  onAddItem,
  onEditItem
}) => {

  const user = useAuthStore((state) => state.user);

  const {
    data: portfolio,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['portfolio', providerData.id],
    queryFn: async () => portfolioRepository.getByProviderId(providerData.id)
  })


  const portfolioPermissions = usePermissions(user, providerData.id, 'portfolio')

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Portafolio
        </h2>
        {

          portfolioPermissions.canCreate && <Button
            color="primary"
            variant="bordered"
            startContent={<Plus className="h-4 w-4" />}
            onPress={onAddItem}
          >
            Añadir Elemento
          </Button>
        }
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {
          isLoading && <div className="text-center text-gray-500">Cargando...</div>
        }
        {
          isError && <div className="text-center text-red-500">Error al cargar el portafolio.</div>
        }
        {portfolio && portfolio.items.map((item) => (
          <PortfolioItem
            key={item.id}
            item={item}
            onEdit={onEditItem}
            canEdit={portfolioPermissions.canEdit}
          />
        ))}
      </div>
    </div>
  );
};