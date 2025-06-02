import React from "react";
import { Button } from "@heroui/button";
import { Provider } from "@/core/domain/entities";

interface EditProfileModalProps {
  isOpen: boolean;
  editFormData: Provider | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (field: keyof Provider, value: any) => void;
  onCategoriesChange: (value: string) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  editFormData,
  onClose,
  onSubmit,
  onInputChange,
  onCategoriesChange
}) => {
  if (!isOpen || !editFormData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-content1 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">Editar Perfil</h2>
            <Button
              variant="light"
              onPress={onClose}
              className="text-gray-400 hover:text-gray-300"
            >
              ✕
            </Button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={editFormData.publicContact.email}
                  onChange={(e) => onInputChange("email", e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre Artístico
                </label>
                <input
                  type="text"
                  value={editFormData.artisticName}
                  onChange={(e) => onInputChange("artisticName", e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Biografía
              </label>
              <textarea
                value={editFormData.biography}
                onChange={(e) => onInputChange("biography", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editFormData.publicContact.email}
                  onChange={(e) => onInputChange("email", e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Teléfono (Contacto Público)
                </label>
                <input
                  type="tel"
                  value={editFormData.publicContact.phone}
                  onChange={(e) => onInputChange("publicContact", e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ubicación General
              </label>
              <input
                type="text"
                value={editFormData.generalLocation}
                onChange={(e) => onInputChange("generalLocation", e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Especialidades (separadas por comas)
              </label>
              <input
                type="text"
                value={editFormData.categories.join(", ")}
                onChange={(e) => onCategoriesChange(e.target.value)}
                placeholder="DJ, Música en vivo, Eventos corporativos"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="bordered"
                onPress={onClose}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                color="primary"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Guardar Cambios
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};