import { Mail, Phone, MapPin } from "lucide-react";

interface ContactInfoProps {
  email: string;
  phone?: string;
  location: string;
  layout?: "horizontal" | "vertical";
}

export const ContactInfo: React.FC<ContactInfoProps> = ({
  email,
  phone,
  location,
  layout = "horizontal"
}) => {
  const containerClass = layout === "horizontal"
    ? "flex flex-col sm:flex-row gap-4"
    : "space-y-2";

  return (
    <div className={containerClass}>
      <div className="flex items-center gap-2 text-gray-400">
        <Mail className="h-4 w-4" />
        <span>{email}</span>
      </div>
      {phone && (
        <div className="flex items-center gap-2 text-gray-400">
          <Phone className="h-4 w-4" />
          <span>{phone}</span>
        </div>
      )}
      <div className="flex items-center gap-2 text-gray-400">
        <MapPin className="h-4 w-4" />
        <span>{location}</span>
      </div>
    </div>
  );
};
