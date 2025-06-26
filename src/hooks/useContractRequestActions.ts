import { useMutation, useQueryClient } from '@tanstack/react-query'
import { contractRequestRepository } from '@/core/infrastructure/repositories/inMemory'
import { addToast } from '@heroui/toast'

export const useContractRequestActions = () => {
  const queryClient = useQueryClient()

  const acceptRequest = useMutation({
    mutationFn: async ({ id, message }: { id: string; message?: string }) => {
      const request = await contractRequestRepository.getById(id)
      if (!request) throw new Error('Request not found')

      request.status = 'Accepted'
      request.providerResponseAt = new Date()
      request.providerResponseMessage = message

      return await contractRequestRepository.update(request)
    },
    onSuccess: () => {
      // toast.success('Solicitud aceptada exitosamente')
      addToast({
        color: 'success',
        title: 'Solicitud aceptada',
        description: 'La solicitud de contratación ha sido aceptada exitosamente.'
      })
      queryClient.invalidateQueries({ queryKey: ['contractRequests'] })
    },
    onError: () => {
      // toast.error('Error al aceptar la solicitud')
      addToast({
        color: 'danger',
        title: 'Error al aceptar',
        description: 'Hubo un error al aceptar la solicitud de contratación. Por favor, intenta nuevamente.'
      })
    }
  })

  const rejectRequest = useMutation({
    mutationFn: async ({ id, message }: { id: string; message?: string }) => {
      const request = await contractRequestRepository.getById(id)
      if (!request) throw new Error('Request not found')

      request.status = 'Rejected'
      request.providerResponseAt = new Date()
      request.providerResponseMessage = message

      return await contractRequestRepository.update(request)
    },
    onSuccess: () => {
      // toast.success('Solicitud rechazada')
      addToast({
        color: 'success',
        title: 'Solicitud rechazada',
        description: 'La solicitud de contratación ha sido rechazada exitosamente.'
      })
      queryClient.invalidateQueries({ queryKey: ['contractRequests'] })
    },
    onError: () => {
      // toast.error('Error al rechazar la solicitud')
      addToast({
        color: 'danger',
        title: 'Error al rechazar',
        description: 'Hubo un error al rechazar la solicitud de contratación. Por favor, intenta nuevamente.'
      })
    }
  })

  return {
    acceptRequest: (id: string, message?: string) => acceptRequest.mutateAsync({ id, message }),
    rejectRequest: (id: string, message?: string) => rejectRequest.mutateAsync({ id, message }),
    isLoading: acceptRequest.isPending || rejectRequest.isPending
  }
}