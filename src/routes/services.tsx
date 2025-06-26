import { createFileRoute } from '@tanstack/react-router'
import { serviceRepository as repo } from '@/core/infrastructure/repositories/inMemory/index'
import { useEffect, useState } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { ClientServicesList } from '@/components/ClientServicesList'
import { FilterPanel } from '@/components/FilterPanel'
import { Service } from '@/core/domain/entities'

// const repo = new InMemoryServiceRepository()

export const Route = createFileRoute('/services')({
  component: RouteComponent
});

function RouteComponent() {
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [results, setResults] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  //Filtros
  const [keyword, setkeyword] = useState('')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    setLoading(true)
    repo.getAll().then(arr => {
      setAllServices(arr)
      setResults(arr)
      setLoading(false)
    })
  }, [])

  // función que aplica búsqueda + filtro de categorías
  function applyFilters(q: string, cats: string[]) {
    const tokens = q
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)

    let filtered = tokens.length
      ? allServices.filter(s => {
        const haystack = (
          s.name +
          ' ' +
          s.description +
          ' ' +
          s.categories.join(' ')
        ).toLowerCase()
        return tokens.every(tok => haystack.includes(tok))
      })
      : allServices

    if (cats.length > 0) {
      filtered = filtered.filter(s =>
        cats.every(catId => s.categories.includes(catId))
      )
    }

    setResults(filtered)
  }

  function handleSearch(keyword: string) {
    setkeyword(keyword)
    applyFilters(keyword, categories)
  }

  function handleCategoriesChange(ids: string[]) {
    setCategories(ids)
    applyFilters(keyword, ids)
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col gap-4">
        {/* SearchBar ocupa todo el ancho */}
        <div className="w-full">
          <SearchBar
            onSearch={handleSearch}
            live
          />
        </div>

        {/* FilterPanel queda debajo */}
        <FilterPanel
          selectedCategories={categories}
          onCategoriesChange={handleCategoriesChange}
        />
      </div>

      {loading && <p>Cargando…</p>}

      {!loading && <ClientServicesList services={results} />}

    </div>
  );
}