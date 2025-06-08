// src/components/SearchResults.tsx
import React, { Suspense } from 'react'
import { Service } from '@/core/domain/entities'
import { ServiceCard } from './ServiceCard'
import { EmptyServicesState } from './EmptyServicesState'
import { Spinner } from '@heroui/spinner'

interface SearchResultsProps {
  services: Service[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  services,
  onEdit = () => {},
  onDelete = () => {}
}) => {
  if (services.length === 0) {
    return <EmptyServicesState onCreateService={() => { /* opcional */ }} />
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {services.map(svc => (
        <Suspense key={svc.id} fallback={<Spinner />}>
          <ServiceCard
            service={svc}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </Suspense>
      ))}
    </div>
  )
}