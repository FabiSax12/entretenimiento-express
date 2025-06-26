import React from "react";
import { Tab, Tabs } from "@heroui/tabs";
import { AnimatePresence } from "framer-motion";
import { Provider } from "@/core/domain/entities";
import { ProfileDetails } from "../ProfileDetails";
import { Portfolio } from "../Portfolio";
import { Services } from "../Service";
import { Availability } from "../Availability";
import { ProviderReviews } from "../ProviderReviews";
import { ContractRequestsList } from "@/components/ContractRequestsList";
import { useAuthStore } from "@/stores/authStore";

interface ProfileTabsProps {
  providerData: Provider;
  onAddPortfolioItem: () => void;
  onEditPortfolioItem: (itemId: string) => void;
  onAddService: () => void;
  onEditService: (serviceId: string) => void;
  onDeleteService: (serviceId: string) => void;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  providerData,
  onAddPortfolioItem,
  onEditPortfolioItem,
  onAddService,
  onEditService,
  onDeleteService
}) => {
  const currentUser = useAuthStore(state => state.user);
  const isOwnProfile = currentUser?.id === providerData.id;

  return (
    <AnimatePresence mode="wait">
      <Tabs color="primary" variant="underlined">
        <Tab key="profile" title="Detalles del Perfil">
          <ProfileDetails providerData={providerData} />
        </Tab>

        <Tab key="portfolio" title="Portafolio">
          <Portfolio
            providerData={providerData}
            onAddItem={onAddPortfolioItem}
            onEditItem={onEditPortfolioItem}
          />
        </Tab>

        <Tab key="services" title="Servicios">
          <Services
            providerData={providerData}
            onAddService={onAddService}
            onEditService={onEditService}
            onDeleteService={onDeleteService}
          />
        </Tab>

        <Tab key="availability" title="Disponibilidad">
          <Availability providerData={providerData} />
        </Tab>

        {/* Tab de solicitudes - solo visible para el propietario del perfil */}
        {isOwnProfile && (
          <Tab key="contract-requests" title="Solicitudes">
            <ContractRequestsList providerId={providerData.id} />
          </Tab>
        )}

        <Tab key="reviews" title="Reseñas">
          <ProviderReviews />
        </Tab>
      </Tabs>
    </AnimatePresence>
  );
};