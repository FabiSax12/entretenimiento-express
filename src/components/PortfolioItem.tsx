import React from "react";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import type { PortfolioItem as PortfolioItemType } from "@/core/domain/entities";
import { getItemTypeIcon, getItemTypeColor } from "../utils/portfolioHelper";

interface PortfolioItemProps {
  item: PortfolioItemType;
  onEdit: (itemId: string) => void;
}

export const PortfolioItem: React.FC<PortfolioItemProps> = ({ item, onEdit }) => {
  return (
    <Card className="overflow-hidden bg-content1 shadow-lg">
      <div className="relative h-48 bg-gray-700">
        {item.fileUrl ? (
          <img
            src={item.fileUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            {React.createElement(
              getItemTypeIcon(item.type), { className: "w-5 h-5" }
            )}
          </div>
        )}

        <div className="absolute top-2 right-2">
          <Chip
            size="sm"
            className={`${getItemTypeColor(item.type)} border border-gray-600`}
            startContent={React.createElement(getItemTypeIcon(item.type), { className: "w-5 h-5" })}
          >
            {item.type}
          </Chip>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-lg mb-1 text-foreground">{item.title}</h3>
        <p className="text-gray-300 text-sm mb-3">{item.description}</p>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Añadido: {new Date(item.createdAt).toLocaleDateString()}
          </span>
          <Button
            variant="light"
            size="sm"
            className="text-blue-400 hover:text-blue-300"
            onPress={() => onEdit(item.id)}
          >
            Editar
          </Button>
        </div>
      </div>
    </Card>
  );
};