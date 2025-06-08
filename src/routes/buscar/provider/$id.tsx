import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/buscar/provider/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/buscar/provider/$id"!</div>
}
