import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { RegisterForm } from '@/features/auth/components/RegisterForm'
import logo from '@/assets/logo.png'

export const Route = createFileRoute('/register')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: RegisterPage,
})

function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-hover/5 via-transparent to-accent/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--color-accent-subtle),transparent_50%)]" />

      <div className="w-full max-w-[440px] relative z-10">
        {/* Logo and branding */}
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <div className="mb-6">
            <img src={logo} alt="Emerald Logo" className="h-32 w-32 object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-3 tracking-tight">
            Join Emerald
          </h1>
          <p className="text-text-tertiary text-base">
            Create your account and start your financial journey
          </p>
        </div>

        {/* Register card */}
        <div className="bg-surface-glass backdrop-blur-2xl border border-border rounded-2xl shadow-lg p-8 animate-slide-in">
          <RegisterForm />
        </div>

        {/* Footer link */}
        <div className="text-center mt-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <p className="text-text-tertiary text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-accent hover:text-accent-hover font-semibold transition-colors inline-flex items-center gap-1"
            >
              Sign in
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
