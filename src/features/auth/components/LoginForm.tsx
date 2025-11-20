import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ViewIcon, ViewOffIcon } from 'hugeicons-react'
import { loginSchema, type LoginFormData } from '../schemas/authSchemas'
import { useLogin } from '../hooks/useLogin'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Label } from '@/shared/components/ui/Label'
import { Checkbox } from '@/shared/components/ui/Checkbox'
import { Spinner } from '@/shared/components/ui/Spinner'

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: login, isPending } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const onSubmit = (data: LoginFormData) => {
    login(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-text-primary">
          Email address
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          disabled={isPending}
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      {/* Password field */}
      <div className="space-y-2 pt-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-semibold text-text-primary">
            Password
          </Label>
          <a href="#" className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors">
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Enter your password"
            disabled={isPending}
            error={errors.password?.message}
            className="pr-12"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-tertiary transition-colors duration-200 focus:outline-none"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <ViewOffIcon size={18} />
            ) : (
              <ViewIcon size={18} />
            )}
          </button>
        </div>
      </div>

      {/* Remember me checkbox */}
      <div className="flex items-center gap-2.5 py-2">
        <Checkbox id="rememberMe" {...register('rememberMe')} disabled={isPending} />
        <Label htmlFor="rememberMe" className="text-sm font-medium text-text-secondary cursor-pointer hover:text-text-primary transition-colors">
          Keep me signed in for 30 days
        </Label>
      </div>

      {/* Submit button */}
      <Button type="submit" disabled={isPending} variant="primary" className="w-full mt-6 h-12 text-base">
        {isPending ? (
          <>
            <Spinner size="sm" className="mr-2" />
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </Button>
    </form>
  )
}
