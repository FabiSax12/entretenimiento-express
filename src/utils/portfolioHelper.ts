import { Film, ImageIcon, Music, FileText } from "lucide-react";

export const getItemTypeIcon = (type: string): React.ElementType => {
  switch (type) {
    case "Video": return Film
    case "Photo": return ImageIcon
    case "Audio": return Music
    case "Description": return FileText
    case "Testimonial": return FileText
    default: return FileText
  }
};

export const getItemTypeColor = (type: string) => {
  switch (type) {
    case "Video": return "bg-red-900 text-red-300 border-red-700";
    case "Photo": return "bg-blue-900 text-blue-300 border-blue-700";
    case "Audio": return "bg-purple-900 text-purple-300 border-purple-700";
    case "Description": return "bg-green-900 text-green-300 border-green-700";
    case "Testimonial": return "bg-yellow-900 text-yellow-300 border-yellow-700";
    default: return "bg-content1 text-gray-300 border-gray-600";
  }
};