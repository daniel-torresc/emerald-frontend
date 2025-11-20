import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { router, updateRouterContext } from './app/router'
import { queryClient } from './shared/lib/queryClient'
import { Toaster } from './shared/components/ui/Toast'
import './shared/styles/globals.css'

// Initialize router context with current auth state
updateRouterContext()

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
        {import.meta.env.DEV && <ReactQueryDevtools />}
      </QueryClientProvider>
    </StrictMode>
  )
}
