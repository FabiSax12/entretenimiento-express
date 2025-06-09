import { type FC, useEffect, useState } from 'react'
import { Chip } from '@heroui/chip'
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete'
import { categoryRepository } from '@/core/infrastructure/repositories/inMemory'

interface CategoryFilterProps {
  selected: string[]
  onChange: (ids: string[]) => void
}

interface Option { 
    key: string 
    label: string 
}

export const CategoryFilter: FC<CategoryFilterProps> = ({
  selected,
  onChange
}) => {
  const [options, setOptions] = useState<Option[]>([])
  // Estado local para sincronizar con Autocomplete

  // Cargo las opciones
  useEffect(() => {
    categoryRepository.getAll().then(cats => {
      const opts = cats.map(c => ({ key: c.id, label: c.name }))
      setOptions(opts)
    })
  }, [])

  // HeroUI dispara un solo key por selección/des‐selección
  const handleSelection = (key: React.Key | null) => {
    if (key == null) return
    const id = String(key)
    // toggle en la lista de seleccionados
    const next = selected.includes(id)
      ? selected.filter(x => x !== id)
      : [...selected, id]
    onChange(next)
  }

const available = options.filter(o => !selected.includes(o.key))

  return (
  <>
    <Autocomplete<Option>
      multiple
      placeholder = "Filtrar categorías…"
      defaultItems = {available}
			defaultInputValue=''
      onSelectionChange = {handleSelection}
      className="w-48"
    >
      {item => (
        <AutocompleteItem key={item.key}>
          {item.label}
        </AutocompleteItem>
      )}
    </Autocomplete>
    {/* Chips de categorías seleccionadas */}
      <div className="flex flex-wrap gap-2 mt-2">
        {selected.map(id => {
          const opt = options.find(o => o.key === id)
          const label = opt?.label ?? id
          return (
            <Chip
							className='bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 cursor-pointer'
              key={id}
              variant="bordered"
              color="warning"
							
              onClick={() => handleSelection(id)}
							onClose={() => handleSelection(id)}
            >
              {label}
            </Chip>
          )
        })}
      </div>
    </>
  )
}