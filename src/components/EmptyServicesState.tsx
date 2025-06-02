import { FileText } from "lucide-react";
import { Button } from "@heroui/button";

interface EmptyServicesStateProps {
  onCreateService: () => void;
}

export const EmptyServicesState: React.FC<EmptyServicesStateProps> = ({
  onCreateService
}) => {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">
        <FileText className="h-12 w-12 mx-auto mb-2" />
        <p>No tienes servicios publicados aún</p>
      </div>
      <Button color="primary" onPress={onCreateService}>
        Crear tu primer servicio
      </Button>
    </div>
  );
};