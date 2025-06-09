// src/components/FilterPanel.tsx
import { type FC } from 'react'
import { CategoryFilter } from './filters/CategoryFilter'

interface FilterPanelProps {
  selectedCategories: string[]
  onCategoriesChange: (ids: string[]) => void
}

export const FilterPanel: FC<FilterPanelProps> = ({
  selectedCategories,
  onCategoriesChange,
  // eventType,
  // onEventTypeChange,
  // location,
  // onLocationChange,
  // date,
  // onDateChange
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      <CategoryFilter
        selected={selectedCategories}
        onChange={onCategoriesChange}
      />
    </div>
  )
}