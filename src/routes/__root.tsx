import { Outlet, createRootRouteWithContext, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'

import type { QueryClient } from '@tanstack/react-query'
import { Header } from '@/components/Header.tsx'
import type { AuthState } from '@/stores/authStore.ts'

interface MyRouterContext {
  queryClient: QueryClient
  auth?: AuthState
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  notFoundComponent: RootNotFoundComponent,
  beforeLoad: async ({ context, location }) => {
    if (!context.auth?.isAuthenticated && !location.pathname.includes('/login')) {
      throw redirect({ to: '/login' })
    }
  }
})

function RootComponent() {
  return (
    <>
      <Header />
      <main className='pt-8 px-32 h-screen'>
        <Outlet />
      </main>
      <TanStackRouterDevtools />
      <TanStackQueryLayout />
    </>
  )
}

function RootNotFoundComponent() {
  return (
    <div className='flex h-full w-full items-center justify-center' >
      <div className='text-2xl font-bold'>404 - Not Found</div>
    </div >
  )
}