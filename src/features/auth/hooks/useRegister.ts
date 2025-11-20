import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { authApi } from '../api/authApi'
import { useAuthStore } from '../stores/authStore'
import { toast } from '@/shared/components/ui/Toast'
import type { RegisterCredentials } from '../types'

export const useRegister = () => {
  const router = useRouter()
  const { setUser } = useAuthStore()

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => authApi.register(credentials),
    onSuccess: async (user) => {
      setUser(user)
      toast.success('Account created successfully! Please log in.')
      router.navigate({ to: '/login' })
    },
    onError: (error: any) => {
      const detail = error.response?.data?.detail
      let message = 'Registration failed'

      if (typeof detail === 'string') {
        message = detail
      } else if (Array.isArray(detail)) {
        message = detail.map((err) => err.msg).join(', ')
      }

      toast.error(message)
    },
  })
}
