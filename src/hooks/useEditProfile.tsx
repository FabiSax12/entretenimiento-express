import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Provider } from "@/core/domain/entities/Provider";

export const useEditProfile = (providerData: Provider) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Provider | null>(null);

  const { mutate: setProviderData } = useMutation({
    mutationKey: ['updateProvider'],
    mutationFn: async (updatedProvider: Provider) => {
      console.log("Updating provider:", updatedProvider);
      return updatedProvider;
    }
  });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData) {
      setProviderData(editFormData);
      setIsEditModalOpen(false);
    }
  };

  const handleInputChange = (field: keyof Provider, value: any) => {
    setEditFormData((prev) => {
      if (!prev) return null;
      return { ...prev, [field]: value } as Provider;
    });
  };

  const handleCategoriesChange = (value: string) => {
    const categories = value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    setEditFormData((prev) => {
      if (!prev) return null;
      return { ...prev, categories } as Provider;
    });
  };

  const openEditModal = () => {
    setEditFormData({ ...providerData } as Provider);
    setIsEditModalOpen(true);
  };

  return {
    isEditModalOpen,
    editFormData,
    setIsEditModalOpen,
    handleEditSubmit,
    handleInputChange,
    handleCategoriesChange,
    openEditModal
  };
};