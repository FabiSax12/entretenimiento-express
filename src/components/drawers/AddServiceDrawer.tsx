import React from "react";
import { Button } from "@heroui/button";
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from "@heroui/drawer";
import { Provider, Service } from "@/core/domain/entities";
import { getItemTypeIcon } from "@/utils/portfolioHelper";

interface AddServiceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  serviceFormData: Partial<Service>;
  providerData: Provider;
  onInputChange: (field: keyof Service, value: any) => void;
  onCategoriesChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTogglePortfolioItem: (itemId: string) => void;
}

export const AddServiceDrawer: React.FC<AddServiceDrawerProps> = ({
  isOpen,
  onClose,
  serviceFormData,
  providerData,
  onInputChange,
  onCategoriesChange,
  onSubmit,
  onTogglePortfolioItem
}) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="lg">
      <DrawerContent>
        {(closeDrawer) => (
          <>
            <DrawerHeader>
              <h2 className="text-lg font-semibold text-foreground">
                Añadir Nuevo Servicio
              </h2>
            </DrawerHeader>

            <DrawerBody>
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nombre del Servicio
                    </label>
                    <input
                      type="text"
                      value={serviceFormData.name || ""}
                      onChange={(e) => onInputChange("name", e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Categorías (separadas por comas)
                    </label>
                    <input
                      type="text"
                      value={serviceFormData.categories?.join(", ") || ""}
                      onChange={(e) => onCategoriesChange(e.target.value)}
                      placeholder="DJ, Corporativo, Música en vivo"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={serviceFormData.description || ""}
                    onChange={(e) => onInputChange("description", e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tipo de Precio
                    </label>
                    <select
                      value={serviceFormData.priceType || "fixed"}
                      onChange={(e) => onInputChange("priceType", e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="fixed">Precio Fijo</option>
                      <option value="hourly">Por Hora</option>
                      <option value="event">Por Evento</option>
                      <option value="custom">Personalizado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Precio (CRC)
                    </label>
                    <input
                      type="number"
                      value={serviceFormData.basePrice || ''}
                      onChange={(e) => onInputChange("basePrice", Number(e.target.value))}
                      min="0"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Vincular Elementos del Portafolio
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                    {providerData.portfolio.items.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-md border cursor-pointer transition-colors ${serviceFormData.portfolioItems?.includes(item.id)
                          ? "border-blue-500 bg-blue-900/20"
                          : "border-gray-600 bg-gray-700 hover:border-gray-500"
                          }`}
                        onClick={() => onTogglePortfolioItem(item.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {React.createElement(getItemTypeIcon(item.type), { className: "w-5 h-5" })}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {item.description}
                            </p>
                          </div>
                          {serviceFormData.portfolioItems?.includes(item.id) && (
                            <div className="text-blue-400">✓</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </DrawerBody>

            <DrawerFooter>
              <div className="flex justify-end gap-3">
                <Button
                  variant="bordered"
                  onPress={closeDrawer}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  onPress={() => {
                    console.log("Service added");
                    closeDrawer();
                  }}
                >
                  Añadir Servicio
                </Button>
              </div>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};