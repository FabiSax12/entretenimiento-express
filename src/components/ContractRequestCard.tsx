import React, { useState } from 'react'
import { Card } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Avatar } from '@heroui/avatar'
import { Divider } from '@heroui/divider'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { Textarea } from '@heroui/input'
import { ContractRequest } from '@/core/domain/entities'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, MapPinIcon, ClockIcon, UserIcon } from 'lucide-react'

interface ContractRequestCardProps {
  contractRequest: ContractRequest
  clientName?: string
  serviceName?: string
  onAccept: (id: string, message?: string) => Promise<void>
  onReject: (id: string, message?: string) => Promise<void>
  isLoading?: boolean
}

const statusConfig = {
  'Pending': { color: 'warning', label: 'Pendiente' },
  'Accepted': { color: 'success', label: 'Aceptada' },
  'Rejected': { color: 'danger', label: 'Rechazada' },
  'Expired': { color: 'default', label: 'Expirada' }
} as const

export const ContractRequestCard: React.FC<ContractRequestCardProps> = ({
  contractRequest,
  clientName = 'Cliente',
  serviceName = 'Servicio',
  onAccept,
  onReject,
  isLoading = false
}) => {
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [responseType, setResponseType] = useState<'accept' | 'reject'>('accept')
  const [responseMessage, setResponseMessage] = useState('')

  const statusInfo = statusConfig[contractRequest.status]
  const isPending = contractRequest.status === 'Pending'

  const handleResponse = async () => {
    try {
      if (responseType === 'accept') {
        await onAccept(contractRequest.id, responseMessage)
      } else {
        await onReject(contractRequest.id, responseMessage)
      }
      setShowResponseModal(false)
      setResponseMessage('')
    } catch (error) {
      console.error('Error responding to contract request:', error)
    }
  }

  const openResponseModal = (type: 'accept' | 'reject') => {
    setResponseType(type)
    setShowResponseModal(true)
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-3">
            <Avatar
              size="md"
              name={clientName}
              className="flex-shrink-0"
            />
            <div>
              <h3 className="font-semibold text-lg">{serviceName}</h3>
              <p className="text-sm text-gray-500">Solicitud de {clientName}</p>
              <p className="text-xs text-gray-400">
                {formatDistanceToNow(contractRequest.requestedAt, {
                  addSuffix: true,
                  locale: es
                })}
              </p>
            </div>
          </div>
          <Chip
            size="sm"
            color={statusInfo.color as any}
            variant="flat"
          >
            {statusInfo.label}
          </Chip>
        </div>

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

        {contractRequest.clientMessage && (
          <>
            <Divider className="my-4" />
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Mensaje del cliente:</h4>
              <p className="text-sm p-3 rounded-lg">
                {contractRequest.clientMessage}
              </p>
            </div>
          </>
        )}

        {contractRequest.providerResponseMessage && (
          <>
            <Divider className="my-4" />
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tu respuesta:</h4>
              <p className="text-sm  p-3 rounded-lg">
                {contractRequest.providerResponseMessage}
              </p>
            </div>
          </>
        )}

        {isPending && (
          <>
            <Divider className="my-4" />
            <div className="flex gap-3">
              <Button
                color="success"
                variant="flat"
                size="sm"
                onPress={() => openResponseModal('accept')}
                isLoading={isLoading}
                className="flex-1"
              >
                Aceptar
              </Button>
              <Button
                color="danger"
                variant="flat"
                size="sm"
                onPress={() => openResponseModal('reject')}
                isLoading={isLoading}
                className="flex-1"
              >
                Rechazar
              </Button>
            </div>
          </>
        )}
      </Card>

      <Modal isOpen={showResponseModal} onClose={() => setShowResponseModal(false)}>
        <ModalContent>
          <ModalHeader>
            {responseType === 'accept' ? 'Aceptar Solicitud' : 'Rechazar Solicitud'}
          </ModalHeader>
          <ModalBody>
            <p className="text-sm text-gray-600 mb-4">
              {responseType === 'accept'
                ? 'Estás a punto de aceptar esta solicitud de contratación. Puedes incluir un mensaje opcional para el cliente.'
                : 'Estás a punto de rechazar esta solicitud. Te recomendamos incluir una explicación cortés para el cliente.'
              }
            </p>
            <Textarea
              label="Mensaje (opcional)"
              placeholder={responseType === 'accept'
                ? "Ej: Perfecto! Confirmo mi disponibilidad para esa fecha. Me pondré en contacto contigo para coordinar los detalles."
                : "Ej: Lamentablemente no tengo disponibilidad para esa fecha. Te invito a revisar otras fechas disponibles."
              }
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              maxRows={4}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={() => setShowResponseModal(false)}
            >
              Cancelar
            </Button>
            <Button
              color={responseType === 'accept' ? 'success' : 'danger'}
              onPress={handleResponse}
              isLoading={isLoading}
            >
              {responseType === 'accept' ? 'Aceptar Solicitud' : 'Rechazar Solicitud'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}