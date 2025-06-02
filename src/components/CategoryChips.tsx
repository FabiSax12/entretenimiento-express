import { Chip } from "@heroui/chip";

interface CategoryChipsProps {
  categories: string[];
  variant?: "bordered" | "flat" | "solid";
  color?: "primary" | "secondary" | "default";
  size?: "sm" | "md" | "lg";
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  variant = "bordered",
  color = "primary",
  size = "md"
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category, index) => (
        <Chip
          key={index}
          variant={variant}
          color={color}
          size={size}
        >
          {category}
        </Chip>
      ))}
    </div>
  );
};