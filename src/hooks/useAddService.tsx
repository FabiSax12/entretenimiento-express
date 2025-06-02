import { useState } from "react";
import { useMutation, QueryClient } from "@tanstack/react-query";
import { Service, Provider } from "@/core/domain/entities";

export const useAddService = (providerData: Provider) => {
  const [isAddServiceDrawerOpen, setIsAddServiceDrawerOpen] = useState(false);
  const [serviceFormData, setServiceFormData] = useState<Partial<Service>>({});

  const addServiceMutation = useMutation({
    mutationKey: ['addService', providerData.id],
    mutationFn: async (newService: Service) => {
      const queryClient = new QueryClient();
      queryClient.setQueryData(['provider', providerData.id], (oldData: Provider | undefined) => {
        if (!oldData) return oldData;
        oldData.addService(newService);
        return oldData;
      });
    }
  });

  const handleServiceInputChange = (field: keyof Service, value: any) => {
    setServiceFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addServiceMutation.mutate(
      new Service(
        crypto.randomUUID(),
        serviceFormData.name || '',
        serviceFormData.description || '',
        serviceFormData.basePrice || 0,
        serviceFormData.priceType || 'Fixed',
        providerData.id,
        true,
        new Date(),
        serviceFormData.categories || [],
        serviceFormData.portfolioItems || [],
        serviceFormData.estimatedDuration || '',
        serviceFormData.technicalRequirements || ''
      )
    );
    setIsAddServiceDrawerOpen(false);
  };

  const togglePortfolioItem = (itemId: string) => {
    setServiceFormData((prev) => ({
      ...prev,
      portfolioItems: prev.portfolioItems?.includes(itemId)
        ? prev.portfolioItems.filter((id) => id !== itemId)
        : [...(prev.portfolioItems || []), itemId],
    } as Service));
  };

  return {
    isAddServiceDrawerOpen,
    setIsAddServiceDrawerOpen,
    serviceFormData,
    setServiceFormData,
    handleServiceInputChange,
    handleServiceSubmit,
    togglePortfolioItem,
    addServiceMutation
  };
};