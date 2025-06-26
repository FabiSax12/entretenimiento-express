import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Spinner } from '@heroui/spinner'
import { Select, SelectItem } from '@heroui/select'
import { Input } from '@heroui/input'
import { Button } from '@heroui/button'
import { ClientContractRequestCard } from './ClientContractRequestCard'
import { contractRequestRepository, providerRepository, serviceRepository } from '@/core/infrastructure/repositories/inMemory'
import { Search, PlusIcon } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

interface ClientContractRequestsListProps {
  clientId: string
}

const statusFilters = [
  { key: 'all', label: 'Todas' },
  { key: 'Pending', label: 'Pendientes' },
  { key: 'Accepted', label: 'Aceptadas' },
  { key: 'Rejected', label: 'Rechazadas' },
  { key: 'Expired', label: 'Expiradas' }
]

export const ClientContractRequestsList: React.FC<ClientContractRequestsListProps> = ({
  clientId
}) => {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const { data: contractRequests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['clientContractRequests', clientId],
    queryFn: () => contractRequestRepository.getByClientId(clientId),
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 30
  })

  const { data: providers } = useQuery({
    queryKey: ['providers'],
    queryFn: () => providerRepository.getAll(),
    staleTime: 1000 * 60 * 5
  })

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceRepository.getAll(),
    staleTime: 1000 * 60 * 5
  })

  const filteredRequests = React.useMemo(() => {
    if (!contractRequests) return []

    return contractRequests
      .filter(request => {
        const statusMatch = statusFilter === 'all' || request.status === statusFilter

        const provider = providers?.find(p => p.id === request.providerId)
        const service = services?.find(s => s.id === request.serviceId)
        const searchMatch = searchTerm === '' ||
          provider?.artisticName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.eventType.toLowerCase().includes(searchTerm.toLowerCase())

        return statusMatch && searchMatch
      })
      .sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime()) // Más recientes primero
  }, [contractRequests, statusFilter, searchTerm, providers, services])

  const handleContactProvider = (providerId: string) => {
    // Aquí podrías navegar al perfil del proveedor o abrir un chat
    window.open(`/provider/${providerId}`, '_blank')

  }

  if (isLoadingRequests) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mis Solicitudes</h1>
          <p className="text-gray-600 dark:text-gray-400">Sigue el estado de tus solicitudes de contratación</p>
        </div>
        <Button
          color="primary"
          startContent={<PlusIcon className="w-4 h-4" />}
          onPress={() => navigate({ to: '/services' })}
        >
          Nueva Solicitud
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar por proveedor, servicio o tipo de evento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startContent={<Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />}
            className="w-full"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            placeholder="Filtrar por estado"
            selectedKeys={[statusFilter]}
            onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
          >
            {statusFilters.map(filter => (
              <SelectItem key={filter.key}>
                {filter.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
            {contractRequests?.length || 0}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-300">Total Enviadas</div>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
            {contractRequests?.filter(r => r.status === 'Pending').length || 0}
          </div>
          <div className="text-sm text-yellow-600 dark:text-yellow-300">Pendientes</div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-800 dark:text-green-200">
            {contractRequests?.filter(r => r.status === 'Accepted').length || 0}
          </div>
          <div className="text-sm text-green-600 dark:text-green-300">Aceptadas</div>
        </div>
        <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-800 dark:text-red-200">
            {contractRequests?.filter(r => r.status === 'Rejected').length || 0}
          </div>
          <div className="text-sm text-red-600 dark:text-red-300">Rechazadas</div>
        </div>
      </div>

      {/* Lista de solicitudes */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">
              {contractRequests?.length === 0 ? 'No has enviado solicitudes' : 'No hay solicitudes'}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              {contractRequests?.length === 0
                ? 'Comienza explorando proveedores y servicios para enviar tu primera solicitud.'
                : `No hay solicitudes con estado "${statusFilters.find(f => f.key === statusFilter)?.label}".`
              }
            </p>
            {contractRequests?.length === 0 && (
              <Button
                color="primary"
                variant="flat"
                onPress={() => window.location.href = '/search'}
              >
                Explorar Servicios
              </Button>
            )}
          </div>
        ) : (
          filteredRequests.map(request => {
            const provider = providers?.find(p => p.id === request.providerId)
            const service = services?.find(s => s.id === request.serviceId)

            return (
              <ClientContractRequestCard
                key={request.id}
                contractRequest={request}
                providerName={provider?.artisticName}
                serviceName={service?.name}
                onContactProvider={handleContactProvider}
              />
            )
          })
        )}
      </div>
    </div>
  )
}