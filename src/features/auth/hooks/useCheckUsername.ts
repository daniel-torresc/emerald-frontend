import { useQuery } from '@tanstack/react-query'
import { authApi } from '../api/authApi'
import { authQueryKeys } from '../lib/authQueryKeys'

interface UseCheckUsernameOptions {
  enabled?: boolean
}

/**
 * Hook to check if a username is available for registration.
 * Should be used with debounced input value to avoid excessive API calls.
 *
 * @param username - The username to check
 * @param options - Query options (enabled)
 * @returns Query result with availability status
 *
 * @example
 * ```tsx
 * const [username, setUsername] = useState('')
 * const debouncedUsername = useDebounce(username, 500)
 *
 * const { data, isLoading } = useCheckUsername(debouncedUsername, {
 *   enabled: debouncedUsername.length >= 3
 * })
 *
 * if (data && !data.available) {
 *   // Show "username taken" message
 * }
 * ```
 */
export const useCheckUsername = (username: string, options?: UseCheckUsernameOptions) => {
  return useQuery({
    queryKey: authQueryKeys.checkUsername.detail(username),
    queryFn: () => authApi.checkUsername(username),
    enabled: options?.enabled ?? false,
    staleTime: 5 * 60 * 1000, // 5 minutes - usernames don't change often
    retry: 1,
    // Prevent refetching on window focus - username availability is relatively stable
    refetchOnWindowFocus: false,
    // Cache successful checks longer
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}
