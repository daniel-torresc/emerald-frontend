import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { authApi } from '../api/authApi'
import { useAuthStore } from '../stores/authStore'
import { toast } from '@/shared/components/ui/Toast'

export const useLogout = () => {
  const router = useRouter()
  const { logout, tokens } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      if (tokens?.refresh_token) {
        await authApi.logout(tokens.refresh_token)
      }
    },
    onSuccess: () => {
      logout()
      queryClient.clear() // Clear all cached data
      toast.success('Logged out successfully')
      router.navigate({ to: '/login' })
    },
    onError: (error: any) => {
      // Still logout locally even if API call fails
      logout()
      queryClient.clear()
      router.navigate({ to: '/login' })

      const message = error.response?.data?.detail || 'Logout failed'
      toast.error(message)
    },
  })
}
