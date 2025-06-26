import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Spinner } from '@heroui/spinner'
import { Select, SelectItem } from '@heroui/select'
import { Input } from '@heroui/input'
import { ContractRequestCard } from './ContractRequestCard'
import { useContractRequestActions } from '@/hooks/useContractRequestActions'
import { contractRequestRepository, userRepository, serviceRepository } from '@/core/infrastructure/repositories/inMemory'
import { Search } from 'lucide-react'

interface ContractRequestsListProps {
  providerId: string
}

const statusFilters = [
  { key: 'all', label: 'Todas' },
  { key: 'Pending', label: 'Pendientes' },
  { key: 'Accepted', label: 'Aceptadas' },
  { key: 'Rejected', label: 'Rechazadas' },
  { key: 'Expired', label: 'Expiradas' }
]

export const ContractRequestsList: React.FC<ContractRequestsListProps> = ({ providerId }) => {
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [searchTerm, setSearchTerm] = React.useState('')

  const { acceptRequest, rejectRequest, isLoading } = useContractRequestActions()

  const { data: contractRequests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['contractRequests', providerId],
    queryFn: () => contractRequestRepository.getByProviderId(providerId),
    staleTime: 1000 * 60 * 2
  })

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: () => userRepository.getAll(),
    staleTime: 1000 * 60 * 5
  })

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceRepository.getAll(),
    staleTime: 1000 * 60 * 5
  })

  const filteredRequests = React.useMemo(() => {
    if (!contractRequests) return []

    return contractRequests.filter(request => {
      const statusMatch = statusFilter === 'all' || request.status === statusFilter

      const client = clients?.find(c => c.id === request.clientId)
      const service = services?.find(s => s.id === request.serviceId)
      const searchMatch = searchTerm === '' ||
        client?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.eventType.toLowerCase().includes(searchTerm.toLowerCase())

      return statusMatch && searchMatch
    })
  }, [contractRequests, statusFilter, searchTerm, clients, services])

  if (isLoadingRequests) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar por cliente, servicio o tipo de evento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startContent={<Search className="w-4 h-4 text-gray-400" />}
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

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-100/80 to-yellow-200/60 dark:from-yellow-900/40 dark:to-yellow-800/60 shadow-sm border border-yellow-200 dark:border-yellow-800">
          <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
            {contractRequests?.filter(r => r.status === 'Pending').length || 0}
          </div>
          <div className="text-sm text-yellow-600 dark:text-yellow-300">Pendientes</div>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-r from-green-100/80 to-green-200/60 dark:from-green-900/40 dark:to-green-800/60 shadow-sm border border-green-200 dark:border-green-800">
          <div className="text-2xl font-bold text-green-800 dark:text-green-200">
            {contractRequests?.filter(r => r.status === 'Accepted').length || 0}
          </div>
          <div className="text-sm text-green-600 dark:text-green-300">Aceptadas</div>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-r from-red-100/80 to-red-200/60 dark:from-red-900/40 dark:to-red-800/60 shadow-sm border border-red-200 dark:border-red-800">
          <div className="text-2xl font-bold text-red-800 dark:text-red-200">
            {contractRequests?.filter(r => r.status === 'Rejected').length || 0}
          </div>
          <div className="text-sm text-red-600 dark:text-red-300">Rechazadas</div>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-r from-gray-100/80 to-gray-200/60 dark:from-gray-900/40 dark:to-gray-800/60 shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {contractRequests?.length || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total</div>
        </div>
      </div>

      {/* Lista de solicitudes */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No hay solicitudes</div>
            <p className="text-gray-500 text-sm">
              {statusFilter === 'all'
                ? 'Aún no has recibido solicitudes de contratación.'
                : `No hay solicitudes con estado "${statusFilters.find(f => f.key === statusFilter)?.label}".`
              }
            </p>
          </div>
        ) : (
          filteredRequests.map(request => {
            const client = clients?.find(c => c.id === request.clientId)
            const service = services?.find(s => s.id === request.serviceId)

            return (
              <ContractRequestCard
                key={request.id}
                contractRequest={request}
                clientName={client?.email}
                serviceName={service?.name}
                onAccept={acceptRequest}
                onReject={rejectRequest}
                isLoading={isLoading}
              />
            )
          })
        )}
      </div>
    </div>
  )
}