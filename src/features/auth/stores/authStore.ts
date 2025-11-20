import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  username: string
  full_name: string | null
  is_active: boolean
  is_admin: boolean
  created_at: string
  updated_at: string
  last_login_at: string | null
}

interface AuthTokens {
  access_token: string
  refresh_token: string
  expires_in: number
}

interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setTokens: (tokens: AuthTokens | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setTokens: (tokens) => set({ tokens }),
      logout: () => {
        set({ user: null, tokens: null, isAuthenticated: false })

        // Broadcast logout to other tabs
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('emerald-auth-event', JSON.stringify({
            type: 'logout',
            timestamp: Date.now()
          }))
          // Clean up the event marker after a short delay
          setTimeout(() => {
            window.localStorage.removeItem('emerald-auth-event')
          }, 100)
        }
      },
    }),
    {
      name: 'emerald-auth',
      storage: createJSONStorage(() => localStorage),
      // Only persist user data and tokens
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Cross-tab synchronization - Initialize after a short delay to ensure store is ready
if (typeof window !== 'undefined') {
  // Wait for next tick to ensure store is initialized
  setTimeout(() => {
    // Listen for storage events from other tabs
    window.addEventListener('storage', (e) => {
    // Handle logout events from other tabs
    if (e.key === 'emerald-auth-event' && e.newValue) {
      try {
        const event = JSON.parse(e.newValue)

        if (event.type === 'logout') {
          // Logout was triggered in another tab
          const currentState = useAuthStore.getState()

          // Only process if currently authenticated
          if (currentState.isAuthenticated) {
            // Clear auth state
            useAuthStore.setState({
              user: null,
              tokens: null,
              isAuthenticated: false
            })

            // Optionally redirect to login
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
              window.location.href = '/login'
            }
          }
        }
      } catch (error) {
        console.error('Error processing cross-tab auth event:', error)
      }
    }

    // Handle direct changes to auth storage (login/update from another tab)
    if (e.key === 'emerald-auth' && e.newValue) {
      try {
        const newState = JSON.parse(e.newValue)
        const currentState = useAuthStore.getState()

        // Check if authentication state changed
        const wasAuthenticated = currentState.isAuthenticated
        const isNowAuthenticated = newState.state?.isAuthenticated ?? false

        // If logged in from another tab, sync the state
        if (!wasAuthenticated && isNowAuthenticated) {
          useAuthStore.setState({
            user: newState.state.user,
            tokens: newState.state.tokens,
            isAuthenticated: true
          })
        }

        // If token was refreshed in another tab, sync it
        if (wasAuthenticated && isNowAuthenticated) {
          const currentTokens = currentState.tokens?.access_token
          const newTokens = newState.state.tokens?.access_token

          if (currentTokens !== newTokens && newTokens) {
            useAuthStore.setState({
              tokens: newState.state.tokens
            })
          }
        }
      } catch (error) {
        console.error('Error syncing auth state across tabs:', error)
      }
    }
    })
  }, 0)

  // Alternative: Use BroadcastChannel API for modern browsers
  if ('BroadcastChannel' in window) {
    const authChannel = new BroadcastChannel('emerald-auth-channel')

    authChannel.onmessage = (event) => {
      if (event.data.type === 'logout') {
        const currentState = useAuthStore.getState()

        if (currentState.isAuthenticated) {
          useAuthStore.setState({
            user: null,
            tokens: null,
            isAuthenticated: false
          })

          if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            window.location.href = '/login'
          }
        }
      }
    }

    // Enhance logout to also broadcast via BroadcastChannel
    const originalLogout = useAuthStore.getState().logout
    useAuthStore.setState({
      logout: () => {
        originalLogout()
        authChannel.postMessage({ type: 'logout', timestamp: Date.now() })
      }
    })
  }
}
