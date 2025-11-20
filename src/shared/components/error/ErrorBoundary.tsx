import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '../ui/Button'

interface Props {
  children: ReactNode
  fallback?: (error: Error, reset: () => void) => ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary component to catch and handle React errors gracefully.
 * Prevents the entire app from crashing when an error occurs in a component tree.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 *
 * @example With custom fallback
 * ```tsx
 * <ErrorBoundary
 *   fallback={(error, reset) => (
 *     <div>
 *       <h1>Something went wrong</h1>
 *       <button onClick={reset}>Try again</button>
 *     </div>
 *   )}
 * >
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    // Here you could also send the error to an error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo })
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  override render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError)
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-background">
          <div className="w-full max-w-[540px] text-center">
            <div className="bg-surface-glass backdrop-blur-2xl border border-border rounded-2xl shadow-lg p-12">
              {/* Error icon */}
              <div className="mb-6">
                <svg
                  className="w-20 h-20 text-error mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              {/* Title and description */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary mb-3 tracking-tight">
                  Something went wrong
                </h1>
                <p className="text-text-secondary text-base leading-relaxed mb-4">
                  We encountered an unexpected error. Please try refreshing the page or contact
                  support if the problem persists.
                </p>

                {/* Error details (only in development) */}
                {import.meta.env.DEV && this.state.error && (
                  <details className="mt-4 text-left">
                    <summary className="cursor-pointer text-sm text-text-tertiary hover:text-text-secondary mb-2">
                      Error details
                    </summary>
                    <div className="bg-surface-elevated border border-border rounded-lg p-4 overflow-auto max-h-40">
                      <code className="text-xs text-error block whitespace-pre-wrap break-all">
                        {this.state.error.toString()}
                        {this.state.error.stack && `\n\n${this.state.error.stack}`}
                      </code>
                    </div>
                  </details>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="accent" onClick={this.resetError} className="min-w-[140px]">
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

                <Button
                  variant="secondary"
                  onClick={() => window.location.href = '/'}
                  className="min-w-[140px]"
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
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Go to Home
                </Button>
              </div>
            </div>

            {/* Footer hint */}
            <div className="mt-8">
              <p className="text-text-tertiary text-sm">
                Need help?{' '}
                <a
                  href="mailto:support@emerald.app"
                  className="text-accent hover:text-accent-hover font-medium transition-colors underline"
                >
                  Contact support
                </a>
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
