import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { Button } from '@/shared/components/ui/Button'
import logo from '@/assets/logo.png'

export const Route = createFileRoute('/$404')({
  component: NotFoundPage,
})

function NotFoundPage() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.history.back()
    } else {
      router.navigate({ to: isAuthenticated ? '/' : '/login' })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-dark/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: '1s' }}
      />

      <div className="w-full max-w-[540px] relative z-10 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <Link to={isAuthenticated ? '/' : '/login'}>
            <img src={logo} alt="Emerald Logo" className="h-24 w-24 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        {/* Error content */}
        <div className="bg-surface-glass backdrop-blur-2xl border border-border rounded-2xl shadow-lg p-12 animate-slide-in">
          {/* 404 Number */}
          <div className="mb-6">
            <h1 className="text-9xl font-bold text-accent/20 leading-none">404</h1>
          </div>

          {/* Title and description */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-text-primary mb-3 tracking-tight">
              Page not found
            </h2>
            <p className="text-text-secondary text-base leading-relaxed">
              The page you're looking for doesn't exist or has been moved.
              <br />
              Let's get you back on track.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="accent"
              onClick={handleGoBack}
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Go back
            </Button>

            {isAuthenticated ? (
              <Link to="/">
                <Button variant="secondary" className="w-full sm:w-auto min-w-[140px]">
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
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="secondary" className="w-full sm:w-auto min-w-[140px]">
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
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Go to Login
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Footer hint */}
        <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <p className="text-text-tertiary text-sm">
            Lost? Check the URL or{' '}
            <a
              href="mailto:support@emerald.app"
              className="text-accent hover:text-accent-hover font-medium transition-colors underline"
            >
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
