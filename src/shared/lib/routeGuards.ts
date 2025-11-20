import { redirect } from '@tanstack/react-router'

/**
 * Route guard utilities for TanStack Router.
 * These functions should be used in the `beforeLoad` hook of file routes.
 */

interface RouteContext {
  auth: {
    isAuthenticated: boolean
  }
}

interface BeforeLoadContext {
  context: RouteContext
}

interface RouteLocation {
  pathname: string
  search?: Record<string, any>
  hash?: string
}

/**
 * Protects a route by requiring authentication.
 * Redirects to login page if user is not authenticated, preserving the intended destination.
 *
 * @param context - The route context containing auth state (or beforeLoad context)
 * @param location - The current location (for redirect back)
 *
 * @example
 * ```ts
 * export const Route = createFileRoute('/dashboard')({
 *   beforeLoad: ({ context, location }) => {
 *     requireAuth(context, location)
 *   },
 *   component: Dashboard,
 * })
 * ```
 */
export function requireAuth(context: RouteContext | BeforeLoadContext | any, location?: RouteLocation): void {
  const authContext = 'context' in context ? context.context : context
  if (!authContext.auth?.isAuthenticated) {
    throw redirect({
      to: '/login',
      search: location ? {
        // Preserve the intended destination for redirect after login
        redirect: location.pathname,
      } : undefined,
    })
  }
}

/**
 * Protects a route by redirecting authenticated users away.
 * Useful for login/register pages.
 *
 * @param context - The route context containing auth state (or beforeLoad context)
 * @param redirectTo - Where to redirect authenticated users (default: '/')
 *
 * @example
 * ```ts
 * export const Route = createFileRoute('/login')({
 *   beforeLoad: ({ context }) => {
 *     requireGuest(context)
 *   },
 *   component: LoginPage,
 * })
 * ```
 */
export function requireGuest(context: RouteContext | BeforeLoadContext | any, redirectTo: string = '/'): void {
  const authContext = 'context' in context ? context.context : context
  if (authContext.auth?.isAuthenticated) {
    throw redirect({
      to: redirectTo,
    })
  }
}

/**
 * Protects a route by requiring admin role.
 * Redirects to home if user is not authenticated or not an admin.
 *
 * @param context - The route context containing auth state (or beforeLoad context)
 * @param user - The current user object (must have isAdmin property)
 *
 * @example
 * ```ts
 * export const Route = createFileRoute('/admin')({
 *   beforeLoad: ({ context }) => {
 *     const user = useAuthStore.getState().user
 *     requireAdmin(context, user)
 *   },
 *   component: AdminPanel,
 * })
 * ```
 */
export function requireAdmin(
  context: RouteContext | BeforeLoadContext | any,
  user: { isAdmin?: boolean } | null
): void {
  const authContext = 'context' in context ? context.context : context
  if (!authContext.auth?.isAuthenticated) {
    throw redirect({
      to: '/login',
    })
  }

  if (!user?.isAdmin) {
    throw redirect({
      to: '/',
    })
  }
}
