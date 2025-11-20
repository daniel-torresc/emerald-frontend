import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { authApi } from '../api/authApi'
import { useAuthStore } from '../stores/authStore'

export const useCurrentUser = () => {
  const { isAuthenticated, setUser } = useAuthStore()

  const query = useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })

  useEffect(() => {
    if (query.data) {
      setUser(query.data)
    } else if (query.error) {
      setUser(null)
    }
  }, [query.data, query.error, setUser])

  return query
}
