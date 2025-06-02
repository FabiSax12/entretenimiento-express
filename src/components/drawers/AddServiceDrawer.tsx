import React from "react";
import { Button } from "@heroui/button";
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from "@heroui/drawer";
import { Select, SelectItem } from "@heroui/select";
import { Input, Textarea } from "@heroui/input";
import { Form } from "@heroui/form";
import { Checkbox } from "@heroui/checkbox";
import { Provider, Service } from "@/core/domain/entities";
import { getItemTypeIcon } from "@/utils/portfolioHelper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryRepository, portfolioRepository, serviceRepository } from "@/core/infrastructure/repositories/inMemory";
import { addToast } from "@heroui/toast";

interface AddServiceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  providerData: Provider;
}

export const AddServiceDrawer: React.FC<AddServiceDrawerProps> = ({
  isOpen,
  onClose,
  providerData
}) => {

  const queryClient = useQueryClient();

  const {
    data: portfolio
  } = useQuery({
    queryKey: ["portfolio", providerData.id],
    queryFn: async () => portfolioRepository.getByProviderId(providerData.id)
  });

  const {
    data: categories
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => categoryRepository.getAll()
  });

  const createServiceMutation = useMutation({
    mutationFn: (serviceData: Partial<Service>) => {
      return serviceRepository.create({
        ...serviceData,
        providerId: providerData.id
      });
    },
    onSuccess: () => {
      console.log("Service created successfully");
      queryClient.refetchQueries({
        queryKey: ["services", providerData.id]
      })
      addToast({
        title: "Servicio creado",
        description: "El servicio se ha creado exitosamente.",
        color: "success",
        variant: "bordered"
      });
      onClose();
    },
    onError: (error) => {
      console.error("Error creating service:", error);
    }
  })

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const serviceData: Partial<Service> = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      basePrice: Number(formData.get("basePrice")),
      priceType: formData.get("priceType") as Service["priceType"],
      categories: formData.getAll("categories") as string[],
      portfolioItems: formData.getAll("portfolioItems") as string[],
      estimatedDuration: formData.get("estimatedDuration") as string || undefined,
      technicalRequirements: formData.get("technicalRequirements") as string || undefined,
      isActive: true,
      createdAt: new Date(),
      providerId: providerData.id
    };

    createServiceMutation.mutate(serviceData);
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="xl" isDismissable={false}>
      <DrawerContent>
        {(closeDrawer) => (
          <Form
            onSubmit={handleFormSubmit}
            validationBehavior="native"
            className="flex flex-col h-full"
          >
            <DrawerHeader>
              <h2 className="text-lg font-semibold text-foreground">
                Añadir Nuevo Servicio
              </h2>
            </DrawerHeader>

            <DrawerBody className="space-y-6">
              {/* Información básica */}
              <div className="space-y-4">
                <Input
                  name="name"
                  label="Nombre del Servicio"
                  placeholder="Ej: DJ para bodas"
                  isRequired
                  validate={(value) => {
                    if (!value || value.length < 3) {
                      return "El nombre debe tener al menos 3 caracteres";
                    }
                  }}
                />

                <Select
                  name="categories"
                  label="Categorías"
                  placeholder="Selecciona las categorías"
                  selectionMode="multiple"
                  isLoading={!categories}
                  isRequired
                  validate={(value) => {
                    if (!value || (value as unknown as Set<string>).size === 0) {
                      return "Selecciona al menos una categoría";
                    }
                  }}
                >
                  {categories?.map((category) => (
                    <SelectItem key={category.id} textValue={category.name}>
                      {category.name}
                    </SelectItem>
                  )) || []}
                </Select>

                <Textarea
                  name="description"
                  label="Descripción"
                  placeholder="Describe tu servicio en detalle..."
                  rows={4}
                  isRequired
                  validate={(value) => {
                    if (!value || value.length < 10) {
                      return "La descripción debe tener al menos 10 caracteres";
                    }
                  }}
                />
              </div>

              {/* Información de precio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  name="priceType"
                  label="Tipo de Precio"
                  placeholder="Selecciona el tipo"
                  defaultSelectedKeys={["Fixed"]}
                  isRequired
                >
                  <SelectItem key="Fixed" textValue="Fixed">
                    Precio Fijo
                  </SelectItem>
                  <SelectItem key="Hourly" textValue="Hourly">
                    Por Hora
                  </SelectItem>
                  <SelectItem key="PerEvent" textValue="PerEvent">
                    Por Evento
                  </SelectItem>
                  <SelectItem key="StartingFrom" textValue="StartingFrom">
                    Desde (mínimo)
                  </SelectItem>
                </Select>

                <Input
                  name="basePrice"
                  type="number"
                  label="Precio Base (CRC)"
                  placeholder="0"
                  min="0"
                  step="1000"
                  isRequired
                  validate={(value) => {
                    const numValue = Number(value);
                    if (!value || numValue <= 0) {
                      return "El precio debe ser mayor a 0";
                    }
                  }}
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">₡</span>
                    </div>
                  }
                />
              </div>

              {/* Información adicional */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="estimatedDuration"
                  label="Duración Estimada"
                  placeholder="Ej: 4 horas, 1 día completo"
                />

                <Input
                  name="technicalRequirements"
                  label="Requerimientos Técnicos"
                  placeholder="Ej: Acceso a electricidad, espacio 3x3m"
                />
              </div>

              {/* Elementos del portafolio */}
              {portfolio && portfolio.items.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-foreground">
                    Vincular Elementos del Portafolio
                  </h3>
                  <p className="text-xs text-default-500">
                    Selecciona los elementos de tu portafolio relacionados con este servicio
                  </p>

                  <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto p-1">
                    {portfolio.items.map((item) => (
                      <div key={item.id} className="flex">
                        <Checkbox
                          name="portfolioItems"
                          value={item.id}
                          classNames={{
                            base: "inline-flex w-full max-w-full bg-content1 m-0 hover:bg-content2 items-center justify-start cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent data-[selected=true]:border-primary",
                            label: "w-full"
                          }}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className="flex-shrink-0">
                              {React.createElement(getItemTypeIcon(item.type), {
                                className: "w-5 h-5 text-default-500"
                              })}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {item.title}
                              </p>
                              <p className="text-xs text-default-500 truncate">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </DrawerBody>

            <DrawerFooter>
              <div className="flex justify-end gap-3 w-full">
                <Button
                  variant="bordered"
                  onPress={closeDrawer}
                  color="default"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="solid"
                >
                  Añadir Servicio
                </Button>
              </div>
            </DrawerFooter>
          </Form>
        )}
      </DrawerContent>
    </Drawer>
  );
};