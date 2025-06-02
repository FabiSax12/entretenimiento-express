import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@heroui/button";
import { Provider } from "@/core/domain/entities";
import { PortfolioItem } from "./PortfolioItem";

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
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-foreground">Mi Portafolio</h2>
        <Button
          color="primary"
          variant="bordered"
          startContent={<Plus className="h-4 w-4" />}
          onPress={onAddItem}
        >
          Añadir Elemento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providerData.portfolio.items.map((item) => (
          <PortfolioItem
            key={item.id}
            item={item}
            onEdit={onEditItem}
          />
        ))}
      </div>
    </div>
  );
};