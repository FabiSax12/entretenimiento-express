import { type FC, useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/modal'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Textarea } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
import { DatePicker } from '@heroui/date-picker'
import { CalendarDate } from '@internationalized/date'

interface ContractRequestData {
  eventDate: Date
  eventTime?: string
  eventLocation: string
  eventType: string
  clientMessage?: string
}

interface ContractRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ContractRequestData) => Promise<void>
  serviceName: string
  isLoading?: boolean
}

const eventTypes = [
  { key: 'wedding', label: 'Boda' },
  { key: 'birthday', label: 'Cumpleaños' },
  { key: 'corporate', label: 'Evento Corporativo' },
  { key: 'quinceañera', label: 'Quinceañera' },
  { key: 'graduation', label: 'Graduación' },
  { key: 'anniversary', label: 'Aniversario' },
  { key: 'other', label: 'Otro' },
]

export const ContractRequestModal: FC<ContractRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  serviceName,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<ContractRequestData>({
    eventDate: new Date(),
    eventLocation: '',
    eventType: '',
    eventTime: '',
    clientMessage: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ContractRequestData, string>>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ContractRequestData, string>> = {}

    if (!formData.eventLocation.trim()) {
      newErrors.eventLocation = 'La ubicación del evento es requerida'
    }

    if (!formData.eventType) {
      newErrors.eventType = 'El tipo de evento es requerido'
    }

    if (formData.eventDate < new Date()) {
      newErrors.eventDate = 'La fecha del evento debe ser futura'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      await onSubmit(formData)
      // Reset form
      setFormData({
        eventDate: new Date(),
        eventLocation: '',
        eventType: '',
        eventTime: '',
        clientMessage: ''
      })
      setErrors({})
      onClose()
    } catch (error) {
      console.error('Error al enviar solicitud:', error)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isDismissable={false}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Solicitar Contratación</h2>
          <p className="text-sm text-gray-500">Servicio: {serviceName}</p>
        </ModalHeader>

        <ModalBody className="gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <DatePicker
                label="Fecha del Evento"
                isRequired
                value={formData.eventDate ? new CalendarDate(
                  formData.eventDate.getFullYear(),
                  formData.eventDate.getMonth() + 1,
                  formData.eventDate.getDate()
                ) : null}
                onChange={(date) => {
                  if (date) {
                    setFormData(prev => ({
                      ...prev,
                      eventDate: new Date(date.year, date.month - 1, date.day)
                    }))
                  }
                }}
                isInvalid={!!errors.eventDate}
                errorMessage={errors.eventDate}
              />
            </div>

            <Input
              label="Hora del Evento (opcional)"
              placeholder="Ej: 15:00"
              value={formData.eventTime}
              onChange={(e) => setFormData(prev => ({ ...prev, eventTime: e.target.value }))}
            />
          </div>

          <Input
            label="Ubicación del Evento"
            placeholder="Dirección o lugar del evento"
            isRequired
            value={formData.eventLocation}
            onChange={(e) => setFormData(prev => ({ ...prev, eventLocation: e.target.value }))}
            isInvalid={!!errors.eventLocation}
            errorMessage={errors.eventLocation}
          />

          <Select
            label="Tipo de Evento"
            placeholder="Selecciona el tipo de evento"
            isRequired
            selectedKeys={formData.eventType ? [formData.eventType] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string
              setFormData(prev => ({ ...prev, eventType: selectedKey }))
            }}
            isInvalid={!!errors.eventType}
            errorMessage={errors.eventType}
          >
            {eventTypes.map((type) => (
              <SelectItem key={type.key} value={type.key}>
                {type.label}
              </SelectItem>
            ))}
          </Select>

          <Textarea
            label="Mensaje Adicional (opcional)"
            placeholder="Describe detalles específicos, expectativas o preguntas sobre el servicio..."
            value={formData.clientMessage}
            onChange={(e) => setFormData(prev => ({ ...prev, clientMessage: e.target.value }))}
            maxRows={4}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onPress={onClose}
            isDisabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            color="success"
            onPress={handleSubmit}
            isLoading={isLoading}
          >
            Enviar Solicitud
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}