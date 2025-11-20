import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { LoginForm } from '@/features/auth/components/LoginForm'
import logo from '@/assets/logo.png'

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-dark/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-[440px] relative z-10">
        {/* Logo and branding */}
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <div className="mb-6">
            <img src={logo} alt="Emerald Logo" className="h-32 w-32 object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-3 tracking-tight">
            Welcome back
          </h1>
          <p className="text-text-tertiary text-base">
            Continue to your Emerald account
          </p>
        </div>

        {/* Login card */}
        <div className="bg-surface-glass backdrop-blur-2xl border border-border rounded-2xl shadow-lg p-8 animate-slide-in">
          <LoginForm />
        </div>

        {/* Footer link */}
        <div className="text-center mt-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <p className="text-text-tertiary text-sm">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-accent hover:text-accent-hover font-semibold transition-colors inline-flex items-center gap-1"
            >
              Create one now
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
