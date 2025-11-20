import { createRouter } from '@tanstack/react-router'
import { routeTree } from '../routeTree.gen'
import { useAuthStore } from '@/features/auth/stores/authStore'
import '../router.d.ts'

export const router = createRouter({
  routeTree,
  context: {
    auth: {
      isAuthenticated: false,
    },
  },
  defaultPreload: 'intent',
})

// Update router context with auth state
export const updateRouterContext = () => {
  const isAuthenticated = useAuthStore.getState().isAuthenticated
  router.update({
    context: {
      auth: {
        isAuthenticated,
      },
    },
  })
}

// Subscribe to auth changes and update router context
useAuthStore.subscribe((state) => {
  router.update({
    context: {
      auth: {
        isAuthenticated: state.isAuthenticated,
      },
    },
  })
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
