import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from './ErrorBoundary'
import { Button } from '../ui/Button'
import type { ReactNode } from 'react'

interface ApiErrorBoundaryProps {
  children: ReactNode
}

/**
 * Error Boundary specifically designed for handling React Query (API) errors.
 * Integrates with React Query's error reset functionality.
 *
 * @example
 * ```tsx
 * <ApiErrorBoundary>
 *   <DataFetchingComponent />
 * </ApiErrorBoundary>
 * ```
 */
export function ApiErrorBoundary({ children }: ApiErrorBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onError={(error) => {
            // Log API errors
            if (import.meta.env.DEV) {
              console.error('API Error:', error)
            }
          }}
          fallback={(error, resetError) => (
            <div className="min-h-[400px] flex items-center justify-center px-6 py-12">
              <div className="w-full max-w-[480px] text-center">
                <div className="bg-surface border border-border rounded-xl shadow-lg p-8">
                  {/* Error icon */}
                  <div className="mb-6">
                    <svg
                      className="w-16 h-16 text-error mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>

                  {/* Title and description */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-text-primary mb-2">
                      Failed to load data
                    </h2>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      We couldn't fetch the data you requested. This might be due to a network
                      issue or a problem with our servers.
                    </p>
                  </div>

                  {/* Error message */}
                  {error.message && (
                    <div className="mb-6 bg-surface-elevated border border-border rounded-lg p-4">
                      <p className="text-xs text-error font-mono">{error.message}</p>
                    </div>
                  )}

                  {/* Action button */}
                  <Button
                    variant="accent"
                    onClick={() => {
                      reset() // Reset React Query
                      resetError() // Reset Error Boundary
                    }}
                    className="w-full sm:w-auto min-w-[160px]"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Try again
                  </Button>
                </div>
              </div>
            </div>
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
