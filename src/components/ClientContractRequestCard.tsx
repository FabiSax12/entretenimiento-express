import React from 'react'
import { Card } from '@heroui/card'
import { Chip } from '@heroui/chip'
import { Avatar } from '@heroui/avatar'
import { Button } from '@heroui/button'
import { Divider } from '@heroui/divider'
import { ContractRequest } from '@/core/domain/entities'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as PendingIcon,
  Link
} from 'lucide-react'

interface ClientContractRequestCardProps {
  contractRequest: ContractRequest
  providerName?: string
  serviceName?: string
  onContactProvider?: (providerId: string) => void
}

const statusConfig = {
  'Pending': {
    color: 'warning',
    label: 'Pendiente',
    icon: PendingIcon,
    description: 'Esperando respuesta del proveedor'
  },
  'Accepted': {
    color: 'success',
    label: 'Aceptada',
    icon: CheckCircleIcon,
    description: 'El proveedor ha aceptado tu solicitud'
  },
  'Rejected': {
    color: 'danger',
    label: 'Rechazada',
    icon: XCircleIcon,
    description: 'El proveedor ha rechazado tu solicitud'
  },
  'Expired': {
    color: 'default',
    label: 'Expirada',
    icon: ClockIcon,
    description: 'La solicitud ha expirado'
  }
} as const

export const ClientContractRequestCard: React.FC<ClientContractRequestCardProps> = ({
  contractRequest,
  providerName = 'Proveedor',
  serviceName = 'Servicio',
  onContactProvider
}) => {
  const statusInfo = statusConfig[contractRequest.status]
  const StatusIcon = statusInfo.icon

  const getTimeDisplay = () => {
    if (contractRequest.status === 'Pending') {
      return `Enviada ${formatDistanceToNow(contractRequest.requestedAt, {
        addSuffix: true,
        locale: es
      })}`
    }

    if (contractRequest.providerResponseAt) {
      return `Respondida ${formatDistanceToNow(contractRequest.providerResponseAt, {
        addSuffix: true,
        locale: es
      })}`
    }

    return formatDistanceToNow(contractRequest.requestedAt, {
      addSuffix: true,
      locale: es
    })
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <Avatar
            size="md"
            name={providerName}
            className="flex-shrink-0"
          />
          <div>
            <h3 className="font-semibold text-lg">{serviceName}</h3>
            <p className="text-sm text-gray-500">Proveedor: {providerName}</p>
            <p className="text-xs text-gray-400">{getTimeDisplay()}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Chip
            size="sm"
            color={statusInfo.color as any}
            variant="flat"
            startContent={<StatusIcon className="w-3 h-3" />}
          >
            {statusInfo.label}
          </Chip>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">{statusInfo.description}</p>
      </div>

      {/* Detalles del evento */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <CalendarIcon className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">
            {contractRequest.eventDate.toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          {contractRequest.eventTime && (
            <>
              <ClockIcon className="w-4 h-4 text-gray-400 ml-2" />
              <span className="text-gray-600">{contractRequest.eventTime}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <MapPinIcon className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{contractRequest.eventLocation}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <UserIcon className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">Tipo: {contractRequest.eventType}</span>
        </div>
      </div>

      {/* Tu mensaje original */}
      {contractRequest.clientMessage && (
        <>
          <Divider className="my-4" />
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Tu mensaje:</h4>
            <p className="text-sm p-3 rounded-lg">
              {contractRequest.clientMessage}
            </p>
          </div>
        </>
      )}

      {/* Respuesta del proveedor */}
      {contractRequest.providerResponseMessage && (
        <>
          <Divider className="my-4" />
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Respuesta del proveedor:
            </h4>
            <p className={`text-sm p-3 rounded-lg ${contractRequest.status === 'Accepted'
              ? 'text-green-500 bg-green-900/60'
              : 'text-red-500 bg-red-900/60'
              }`}>
              {contractRequest.providerResponseMessage}
            </p>
          </div>
        </>
      )}

      {/* Acciones */}
      {contractRequest.status === 'Accepted' && onContactProvider && (
        <>
          <Divider className="my-4" />
          <div className="flex justify-end">
            <Button
              color="primary"
              variant="flat"
              size="sm"
              onPress={() => onContactProvider(contractRequest.providerId)}
            >
              Contactar Proveedor
            </Button>
            {/* <Link to={} target='_blank'>Contactar Proveedor</Link> */}
          </div>
        </>
      )}
    </Card>
  )
}