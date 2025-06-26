import { type FC, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Spinner } from '@heroui/spinner'
import { categoryRepository } from '@/core/infrastructure/repositories/inMemory'
import { formatPrice } from '@/utils/formatPrice'
import { Card } from '@heroui/card'
import { Chip } from '@heroui/chip'
import { Service } from '@/core/domain/entities'
import { Button } from '@heroui/button'
import { ContractRequestModal } from '@/components/modals/ContractRequestModal'
import { useContractRequest } from '@/hooks/useContractRequest'

interface ClientServiceCardProps {
  service: Service
}

export const ClientServiceCard: FC<ClientServiceCardProps> = ({ service }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { createContractRequest, isLoading: isCreatingRequest } = useContractRequest()

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryRepository.getAll(),
    staleTime: 1000 * 60 * 5
  })

  const handleContractRequest = async (data: any) => {
    await createContractRequest.mutateAsync({
      serviceId: service.id,
      providerId: service.providerId,
      ...data
    })
  }

  if (isLoading) {
    return (
      <Card className="p-6 text-center">
        <Spinner />
      </Card>
    )
  }

  return (
    <>
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">{service.name}</h3>
              <p className="text-gray-300 text-sm mb-3">{service.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Chip
                size="sm"
                className={
                  service.isActive
                    ? "bg-green-900 text-green-300 border-green-700"
                    : "bg-red-900 text-red-300 border-red-700"
                }
              >
                {service.isActive ? "Activo" : "Inactivo"}
              </Chip>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">Categorías</h4>
              <div className="flex flex-wrap gap-1">
                {service.categories.map(categoryId => {
                  const cat = (categories ?? []).find(c => c.id === categoryId)
                  return (
                    <Chip key={categoryId} size="sm" variant="bordered">
                      {cat?.name ?? 'Desconocida'}
                    </Chip>
                  )
                })}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">Precio</h4>
              <p className="text-white font-medium">
                {formatPrice(service.basePrice, service.priceType)}
              </p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-700">
              <Button
                color="success"
                variant="light"
                size="sm"
                onPress={() => setIsModalOpen(true)}
                isDisabled={!service.isActive}
              >
                Contratar
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <ContractRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleContractRequest}
        serviceName={service.name}
        isLoading={isCreatingRequest}
      />
    </>
  )
}