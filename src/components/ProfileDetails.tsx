import { Mail, Phone, MapPin } from "lucide-react";
import { Provider } from "@/core/domain/entities";
import { CategoryChips } from "./CategoryChips";

interface ProfileDetailsProps {
  providerData: Provider;
}

export const ProfileDetails: React.FC<ProfileDetailsProps> = ({ providerData }) => {
  return (
    <div className="bg-content1 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-foreground">
        Información del Perfil
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium">Nombre Artístico</h3>
          <p className="mt-1 text-gray-200">{providerData.artisticName}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-400">Biografía</h3>
          <p className="mt-1 text-gray-200">{providerData.biography}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-400">Contacto Público</h3>
          <div className="mt-1 space-y-2">
            <p className="flex items-center gap-2 text-gray-300">
              <Mail className="h-4 w-4 text-gray-500" />
              {providerData.publicContact.email}
            </p>
            <p className="flex items-center gap-2 text-gray-300">
              <Phone className="h-4 w-4 text-gray-500" />
              {providerData.publicContact.phone || "No disponible"}
            </p>
            <p className="flex items-center gap-2 text-gray-300">
              <MapPin className="h-4 w-4 text-gray-500" />
              {providerData.generalLocation}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-400">Especialidades</h3>
          <div className="mt-2">
            <CategoryChips categories={providerData.categories} />
          </div>
        </div>
      </div>
    </div>
  );
};