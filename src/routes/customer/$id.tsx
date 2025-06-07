import { createFileRoute } from '@tanstack/react-router'
import { MissingURLParamException } from '@/core/domain/exceptions/MissingURLParamException'
//import { serviceRepository } from '@/core/infrastructure/repositories/inMemory'
import { InMemoryServiceRepository } from '@/core/infrastructure/repositories/inMemory/InMemoryServiceRepository'

import { useEffect, useState } from 'react'
import { SearchBar } from '@/components/SearchBar'
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
    });
  }
});

function RouteComponent() {
  const [allServices, setAllServices] = useState<Service[]>([]); // No se usa, pero se puede usar para mostrar todos los servicios
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
  const q = keyword.trim()
                   .toLowerCase()
  // Partimos en tokens y quitamos espacios vacíos
  const tokens = q.split(/\s+/).filter(Boolean)

  if (tokens.length === 0) {
    setResults(allServices)
  } else {
    setResults(
      allServices.filter(svc => {
        const haystack = (
          svc.name +
          ' ' +
          svc.description +
          ' ' +
          svc.categories.join(' ')
        ).toLowerCase()

        // Cada token debe estar en el nombre, descripción o categorías
        return tokens.every(tok => haystack.includes(tok))
      })
    )
  }
}

  return (
    <div className="p-4 space-y-6">
      <SearchBar onSearch={handleSearch} />
      {loading && <p>Cargando…</p>}
      {!loading && results.length === 0 && <p>No hay resultados</p>}
      {!loading && results.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map(p => (
            <li key={p.id} className="border rounded p-4">
              <img src={"https://heroui.com/images/hero-card-complete.jpeg"}
              alt={p.name} className="w-full h-32 object-cover rounded"/>
              <h3 className="mt-2 font-semibold">{p.name}</h3>
              <p className="text-gray-600">${p.basePrice}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

