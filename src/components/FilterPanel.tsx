// src/components/FilterPanel.tsx
import { type FC, useEffect, useState } from 'react'
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete'
import { categoryRepository } from '@/core/infrastructure/repositories/inMemory'

interface CategoryItem { key: string; label: string }
interface FilterPanelProps {
  selectedCategories: string[]
  onCategoriesChange: (ids: string[]) => void
}

export const FilterPanel: FC<FilterPanelProps> = ({
  selectedCategories,
  onCategoriesChange
}) => {
  const [options, setOptions] = useState<CategoryItem[]>([])

  // Cargo todas las categorías
  useEffect(() => {
    categoryRepository.getAll().then(cats =>
      setOptions(cats.map(c => ({ key: c.id, label: c.name })))
    )
  }, [])

const handleSelect = (key: React.Key | null) => {
    if (key == null) return
    const id = String(key)
    let next: string[]
    if (selectedCategories.includes(id)) {
      // si ya estaba, lo quitamos
      next = selectedCategories.filter(c => c !== id)
    } else {
      // si no estaba, lo añadimos
      next = [...selectedCategories, id]
    }
    onCategoriesChange(next)
  }

  return (
    <Autocomplete<CategoryItem>
      multiple                 // habilita multi‐select
      placeholder="Filtrar categorías…"
      defaultItems={options}   // todas las opciones
      onSelectionChange = {handleSelect}
      onInputChange={() => {}}
      className="w-full max-w-xs"
    >
      {item => (
        <AutocompleteItem key={item.key}>
          {item.label}
        </AutocompleteItem>
      )}
    </Autocomplete>
  )
}