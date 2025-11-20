import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { authApi } from '../api/authApi'
import { useAuthStore } from '../stores/authStore'
import { toast } from '@/shared/components/ui/Toast'
import type { LoginCredentials } from '../types'

export const useLogin = () => {
  const router = useRouter()
  const { setTokens, setUser } = useAuthStore()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: async (data) => {
      // Store tokens
      setTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
      })

      // Fetch and store user data
      try {
        const user = await authApi.getCurrentUser()
        setUser(user)
        toast.success('Welcome back!')
        router.navigate({ to: '/' })
      } catch (error) {
        toast.error('Failed to fetch user data')
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Invalid email or password'
      toast.error(message)
    },
  })
}
