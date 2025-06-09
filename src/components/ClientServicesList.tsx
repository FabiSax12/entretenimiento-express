// src/components/ClientServicesList.tsx
import { type FC } from 'react'
import { Service } from '@/core/domain/entities'
import { ClientServiceCard } from './ClientServiceCard'

interface ClientServicesListProps {
  services: Service[]
}

export const ClientServicesList: FC<ClientServicesListProps> = ({
  services
}) => {
  if (services.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No encontramos servicios para tu búsqueda.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map(svc => (
        <ClientServiceCard key={svc.id} service={svc} />
      ))}
    </div>
  )
}