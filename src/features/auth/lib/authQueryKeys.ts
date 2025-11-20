/**
 * Query Key Factory for authentication-related queries.
 *
 * This factory provides a centralized, type-safe way to manage query keys
 * for all auth-related React Query operations. Using a factory pattern ensures:
 * - Consistency across the application
 * - Type safety for query key generation
 * - Easy cache invalidation
 * - Clear query key hierarchy
 *
 * @example
 * ```ts
 * // In a hook
 * useQuery({
 *   queryKey: authQueryKeys.currentUser(),
 *   queryFn: authApi.getCurrentUser
 * })
 *
 * // Invalidate all auth queries
 * queryClient.invalidateQueries({ queryKey: authQueryKeys.all })
 *
 * // Invalidate only username checks
 * queryClient.invalidateQueries({ queryKey: authQueryKeys.checkUsername._def })
 * ```
 */

const baseKey = ['auth'] as const
const checkUsernameBase = [...baseKey, 'checkUsername'] as const
const sessionBase = [...baseKey, 'session'] as const

export const authQueryKeys = {
  /**
   * Base key for all auth-related queries.
   * Use this to invalidate all auth queries at once.
   */
  all: baseKey,

  /**
   * Current authenticated user query key.
   */
  currentUser: () => [...baseKey, 'currentUser'] as const,

  /**
   * Username availability check queries.
   */
  checkUsername: {
    /**
     * Base key for all username check queries.
     */
    _def: checkUsernameBase,

    /**
     * Key for checking a specific username.
     * @param username - The username to check
     */
    detail: (username: string) => [...checkUsernameBase, username] as const,
  },

  /**
   * Session validation queries.
   */
  session: {
    /**
     * Base key for all session queries.
     */
    _def: sessionBase,

    /**
     * Key for session validation.
     */
    validate: () => [...sessionBase, 'validate'] as const,
  },
} as const

/**
 * Type helper to extract query key type from the factory.
 * Useful for typing custom hooks that use these query keys.
 *
 * @example
 * ```ts
 * type CurrentUserQueryKey = AuthQueryKey<typeof authQueryKeys.currentUser>
 * // Result: readonly ["auth", "currentUser"]
 * ```
 */
export type AuthQueryKey<T extends (...args: any[]) => readonly any[]> = ReturnType<T>
