import { createFileRoute } from '@tanstack/react-router'
import { MissingURLParamException } from '@/core/domain/exceptions/MissingURLParamException'
import { InMemoryServiceRepository } from '@/core/infrastructure/repositories/inMemory/InMemoryServiceRepository'
import { useEffect, useState } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { ClientServicesList } from '@/components/ClientServicesList'
import { Service } from '@/core/domain/entities'

const repo = new InMemoryServiceRepository()

export const Route = createFileRoute('/customer/$id')({
  component: RouteComponent,
  loader: async ({ context, params }): Promise<Service> => {
    const { id } = params
    if (!id) throw new MissingURLParamException(['id']);
    return context.queryClient.ensureQueryData({
      queryKey: ['service', id],
      queryFn: () => repo.getById(id),
      staleTime: 1000 * 60 * 5,
      retry: 1,
    })
  }
});

function RouteComponent() {
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [results, setResults] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    repo.getAll().then(arr => {
      setAllServices(arr)
      setResults(arr) 
      setLoading(false)
    })
  },[])

function handleSearch(keyword: string) {
    const tokens = keyword
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)

    if (tokens.length === 0) {
      setResults(allServices)
    } else {
      setResults(
        allServices.filter(s => {
          const haystack = (
            s.name +
            " " +
            s.description +
            " " +
            s.categories.join(" ")
          ).toLowerCase()
          return tokens.every(tok => haystack.includes(tok))
        })
      )
    }
  }

  return (
    <div className="p-4 space-y-6">
      <SearchBar onSearch={handleSearch} live />
      
      {loading && <p>Cargando…</p>}

      {!loading && <ClientServicesList services = { results }/>}
    </div>
  );
}
