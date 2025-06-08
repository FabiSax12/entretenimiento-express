import { useAuthStore } from '@/stores/authStore'
import { Button } from '@heroui/button'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleProviderLogin = async () => {
    await login('djritmo@example.com', 'hashedpass1').then(user => {
      navigate({
        to: "/provider/$id",
        params: { id: user.id }
      })
    })
  }

  const handleClientLogin = async () => {
    await login('johndoe@example.com', 'hashedpass2').then(user => {
      navigate({
        to: "/client/$id",
        params: { id: user.id }
      })
    })
  }

  return <div className='mx-auto flex flex-col items-center justify-center gap-4 p-6 bg-content1 rounded-lg shadow-lg max-w-md'>
    <Button onPress={handleProviderLogin}>Login Como Provider</Button>
    <Button onPress={handleClientLogin}>Login Como Cliente</Button>
  </div>
}
