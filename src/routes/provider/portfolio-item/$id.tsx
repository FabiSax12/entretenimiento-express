import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/provider/portfolio-item/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/portfolio-item/"!</div>
}
