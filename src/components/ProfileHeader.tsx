import { Edit } from "lucide-react";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Provider } from "@/core/domain/entities";
import { CategoryChips } from "./CategoryChips";
import { ContactInfo } from "./ContactInfo";

interface ProfileHeaderProps {
  providerData: Provider;
  onEditClick: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  providerData,
  onEditClick
}) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 p-6 bg-content1 rounded-lg shadow-lg">
      <Avatar
        src={providerData.avatarUrl}
        title="Perfil de Artista"
        alt={providerData.artisticName}
        className="w-24 h-24 rounded-full border-4 border-white shadow-md"
      />

      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {providerData.artisticName}
            </h1>
            <p className="text-gray-300">{providerData.publicContact.email}</p>
          </div>
          <CategoryChips categories={providerData.categories} />
        </div>

        <p className="mt-2 text-gray-300">{providerData.biography}</p>

        <div className="flex justify-between items-end">
          <div className="mt-4">
            <ContactInfo
              email={providerData.publicContact.email}
              phone={providerData.publicContact.phone}
              location={providerData.generalLocation}
            />
          </div>

          <Button
            color="primary"
            size="sm"
            variant="bordered"
            startContent={<Edit className="h-4 w-4" />}
            onPress={onEditClick}
          >
            Editar Perfil
          </Button>
        </div>
      </div>
    </div>
  );
};