import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { Provider } from '@/core/domain/entities';
import { MissingURLParamException } from '@/core/domain/exceptions/MissingURLParamException';
import { useEditProfile } from "@/hooks/useEditProfile";
import { useAddService } from "@/hooks/useAddService";
import { ProfileHeader } from "@/components/ProfileHeader";
import { ProfileTabs } from "@/components/tabs/ProfileTabs";
import { EditProfileModal } from "@/components/modals/EditProfileModal";
import { AddServiceDrawer } from "@/components/drawers/AddServiceDrawer";
import { providerRepository } from '@/core/infrastructure/repositories/inMemory';

export const Route = createFileRoute('/provider/$id')({
  component: RouteComponent,
  loader: async ({ context, params }): Promise<Provider> => {
    const { id } = params
    if (!id) throw new MissingURLParamException(['id']);

    return context.queryClient.ensureQueryData({
      queryKey: ['provider', id],
      queryFn: async () => providerRepository.getById(id),
      staleTime: 1000 * 60 * 5,
      retry: 1,
    });
  }
});

function RouteComponent() {
  const providerData = useLoaderData({ from: Route.fullPath });

  const {
    isEditModalOpen,
    editFormData,
    setIsEditModalOpen,
    handleEditSubmit,
    handleInputChange,
    handleCategoriesChange,
    openEditModal
  } = useEditProfile(providerData);

  const {
    isAddServiceDrawerOpen,
    setIsAddServiceDrawerOpen,
    serviceFormData,
    handleServiceInputChange,
    handleServiceSubmit,
    togglePortfolioItem,
  } = useAddService(providerData);

  // Handlers for portfolio and services
  const handleAddPortfolioItem = () => {
    console.log("Add Portfolio Item clicked");
  };

  const handleEditPortfolioItem = (itemId: string) => {
    console.log(`Edit portfolio item ${itemId}`);
  };

  const handleEditService = (serviceId: string) => {
    console.log(`Edit service ${serviceId}`);
  };

  const handleDeleteService = (serviceId: string) => {
    console.log(`Delete service ${serviceId}`);
  };

  if (!providerData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl bg-gray-900 min-h-screen text-foreground">
        Cargando perfil o perfil no encontrado...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl min-h-screen">
      <ProfileHeader
        providerData={providerData}
        onEditClick={openEditModal}
      />

      <ProfileTabs
        providerData={providerData}
        onAddPortfolioItem={handleAddPortfolioItem}
        onEditPortfolioItem={handleEditPortfolioItem}
        onAddService={() => setIsAddServiceDrawerOpen(true)}
        onEditService={handleEditService}
        onDeleteService={handleDeleteService}
      />

      <EditProfileModal
        isOpen={isEditModalOpen}
        editFormData={editFormData}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        onInputChange={handleInputChange}
        onCategoriesChange={handleCategoriesChange}
      />

      <AddServiceDrawer
        isOpen={isAddServiceDrawerOpen}
        onClose={() => setIsAddServiceDrawerOpen(false)}
        serviceFormData={serviceFormData}
        providerData={providerData}
        onInputChange={handleServiceInputChange}
        onCategoriesChange={handleCategoriesChange}
        onSubmit={handleServiceSubmit}
        onTogglePortfolioItem={togglePortfolioItem}
      />
    </div>
  );
}