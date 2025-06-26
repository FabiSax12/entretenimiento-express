import React from "react";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import type { PortfolioItem as PortfolioItemType } from "@/core/domain/entities";
import { getItemTypeIcon, getItemTypeColor } from "../utils/portfolioHelper";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";

interface PortfolioItemProps {
  item: PortfolioItemType;
  onEdit: (itemId: string) => void;
  canEdit?: boolean;
}

export const PortfolioItem: React.FC<PortfolioItemProps> = ({ item, onEdit, canEdit = false }) => {
  const navigate = useNavigate();
  const params = useParams({ from: '/provider/$id/' });

  return (
    <Card className="overflow-hidden bg-content1 shadow-lg">
      <div className="relative h-48 bg-gray-700">
        {item.fileUrl ? (
          item.type === 'Photo' ? (
            <img
              src={item.fileUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : item.type === 'Video' ? (
            <video
              src={item.fileUrl}
              className="w-full h-full object-cover"
              controls
            />
          ) : item.type === 'Description' ? (
            <iframe
              src={item.fileUrl}
              title={item.title}
              className="w-full h-full object-cover overflow-hidden pointer-events-none scrollbar-hide"
              scrolling="no"
              style={{ minHeight: "100%", pointerEvents: "none" }}
            />
          ) : (
            <iframe />
          )
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
          <div>
            <Button

              color="primary"
              size="sm"
              onPress={() => navigate({ to: `/provider/$id/portfolio-item/$itemId`, params: { id: params.id, itemId: item.id } })}
            >
              Ver
            </Button>
            {
              canEdit && <Button
                variant="light"
                size="sm"
                className="text-blue-400 hover:text-blue-300"
                onPress={() => onEdit(item.id)}
              >
                Editar
              </Button>
            }
          </div>
        </div>
      </div>
    </Card >
  );
};