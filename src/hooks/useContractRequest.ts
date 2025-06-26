// src/hooks/useContractRequest.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ContractRequest } from '@/core/domain/entities'
import { contractRequestRepository } from '@/core/infrastructure/repositories/inMemory'
import { addToast } from '@heroui/toast'
import { useAuthStore } from '@/stores/authStore'

interface CreateContractRequestParams {
  serviceId: string
  providerId: string
  eventDate: Date
  eventTime?: string
  eventLocation: string
  eventType: string
  clientMessage?: string
}

export const useContractRequest = () => {
  const queryClient = useQueryClient()
  const currentClient = useAuthStore((state) => state.user)

  const createContractRequest = useMutation({
    mutationFn: async (params: CreateContractRequestParams) => {
      if (!currentClient) {
        throw new Error('No client is currently authenticated')
      }

      const contractRequest = new ContractRequest(
        `cr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        currentClient.id,
        params.providerId,
        params.serviceId,
        params.eventDate,
        params.eventLocation,
        params.eventType,
        'Pending',
        new Date(),
        params.eventTime,
        params.clientMessage
      )

      return await contractRequestRepository.create(contractRequest)
    },
    onSuccess: (data, variables) => {
      // toast.success('Solicitud de contratación enviada exitosamente')
      addToast({
        color: 'success',
        title: 'Solicitud enviada',
        description: 'Tu solicitud de contratación ha sido enviada exitosamente.'
      })
      queryClient.invalidateQueries({ queryKey: ['contractRequests'] })
      queryClient.invalidateQueries({ queryKey: ['clientContractRequests', data.clientId] })
    },
    onError: (error) => {
      console.error('Error creating contract request:', error)
      // toast.error('Error al enviar la solicitud. Por favor, intenta nuevamente.')
      addToast({
        color: 'danger',
        title: 'Error al enviar',
        description: 'Hubo un error al enviar tu solicitud de contratación. Por favor, intenta nuevamente.'
      })
    }
  })

  return {
    createContractRequest,
    isLoading: createContractRequest.isPending
  }
}