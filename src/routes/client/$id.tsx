import { createFileRoute } from '@tanstack/react-router'
import { ClientContractRequestsList } from '@/components/ClientContractRequestsList'
import { useAuthStore } from '@/stores/authStore'
import { Card } from '@heroui/card'
import { Button } from '@heroui/button'

export const Route = createFileRoute('/client/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const currentUser = useAuthStore(state => state.user)

  // Verificar si el usuario puede ver este perfil
  const isOwnProfile = currentUser?.id === id

  if (!isOwnProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Acceso Restringido</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            No tienes permisos para ver este perfil de cliente.
          </p>
          <Button
            color="primary"
            onPress={() => window.history.back()}
          >
            Regresar
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ClientContractRequestsList clientId={id} />
      </div>
    </div>
  )
}