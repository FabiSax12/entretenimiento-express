import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { HeroUIProvider } from '@heroui/system'
import { ToastProvider } from '@heroui/toast'
import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'
import { PageSpinner } from './components/PageSpinner.tsx'
import { routeTree } from './routeTree.gen'
import './styles.css'
import { useAuthStore } from './stores/authStore.ts'

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProvider.getContext(),
    auth: undefined
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: PageSpinner
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const Providers = () => {
  const auth = useAuthStore()

  return (
    <HeroUIProvider>
      <ToastProvider />
      <TanStackQueryProvider.Provider>
        <RouterProvider router={router} context={{ auth }} />
      </TanStackQueryProvider.Provider>
    </HeroUIProvider>
  )
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <Providers />
    </StrictMode>,
  )
}
