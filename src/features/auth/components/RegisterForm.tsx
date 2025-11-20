import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ViewIcon, ViewOffIcon, Tick02Icon, Cancel01Icon, Loading03Icon } from 'hugeicons-react'
import { registerSchema, type RegisterFormData, getPasswordStrength } from '../schemas/authSchemas'
import { useRegister } from '../hooks/useRegister'
import { useCheckUsername } from '../hooks/useCheckUsername'
import { useDebounce } from '@/shared/hooks'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Label } from '@/shared/components/ui/Label'
import { Checkbox } from '@/shared/components/ui/Checkbox'
import { Spinner } from '@/shared/components/ui/Spinner'
import { cn } from '@/shared/lib/utils'

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { mutate: register, isPending } = useRegister()

  const {
    register: registerField,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
  })

  const password = watch('password')
  const username = watch('username')
  const passwordStrength = password ? getPasswordStrength(password) : null

  // Debounce username input for availability check
  const debouncedUsername = useDebounce(username, 500)

  // Check username availability (only if username is valid length)
  const {
    data: usernameCheckData,
    isLoading: isCheckingUsername,
    error: usernameCheckError,
  } = useCheckUsername(debouncedUsername, {
    enabled:
      debouncedUsername.length >= 3 && debouncedUsername.length <= 50 && !errors.username,
  })

  const onSubmit = (data: RegisterFormData) => {
    // Don't submit if username is taken
    if (usernameCheckData && !usernameCheckData.available) {
      return
    }

    register({
      email: data.email,
      username: data.username,
      password: data.password,
    })
  }

  const strengthColors = {
    weak: 'bg-error',
    medium: 'bg-warning',
    strong: 'bg-success',
  }

  const strengthWidths = {
    weak: 'w-1/3',
    medium: 'w-2/3',
    strong: 'w-full',
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-text-primary">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          disabled={isPending}
          error={errors.email?.message}
          {...registerField('email')}
        />
      </div>

      {/* Username field */}
      <div className="space-y-2 pt-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="username" className="text-sm font-semibold text-text-primary">Username</Label>
          <div className="relative group">
            <svg className="w-4 h-4 text-text-muted cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-surface-elevated border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none w-64 z-10">
              <p className="text-xs text-text-secondary text-center">
                3-50 characters. Letters, numbers, hyphens, and underscores only.
              </p>
            </div>
          </div>
        </div>
        <div className="relative">
          <Input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="johndoe"
            disabled={isPending}
            error={errors.username?.message}
            className="pr-10"
            {...registerField('username')}
          />
          {/* Username availability indicator */}
          {debouncedUsername.length >= 3 && !errors.username && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isCheckingUsername ? (
                <Loading03Icon size={20} className="text-text-tertiary animate-spin" />
              ) : usernameCheckError ? (
                <Cancel01Icon size={20} className="text-error" />
              ) : usernameCheckData?.available ? (
                <Tick02Icon size={20} className="text-success" />
              ) : (
                <Cancel01Icon size={20} className="text-error" />
              )}
            </div>
          )}
        </div>

        {/* Username availability message */}
        {debouncedUsername.length >= 3 && !errors.username && (
          <div className="text-xs">
            {isCheckingUsername ? (
              <p className="text-text-secondary">Checking availability...</p>
            ) : usernameCheckError ? (
              <p className="text-error">Error checking username availability</p>
            ) : usernameCheckData?.available ? (
              <p className="text-success">Username is available</p>
            ) : (
              <p className="text-error">Username is already taken</p>
            )}
          </div>
        )}
      </div>

      {/* Password field with strength indicator */}
      <div className="space-y-2 pt-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="password" className="text-sm font-semibold text-text-primary">Password</Label>
          <div className="relative group">
            <svg className="w-4 h-4 text-text-muted cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-surface-elevated border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none w-64 z-10">
              <p className="text-xs text-text-secondary text-center">
                Must be at least 8 characters with uppercase, lowercase, number, and special character.
              </p>
            </div>
          </div>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            disabled={isPending}
            error={errors.password?.message}
            className="pr-10"
            {...registerField('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-tertiary transition-colors duration-200 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? (
              <ViewOffIcon size={18} />
            ) : (
              <ViewIcon size={18} />
            )}
          </button>
        </div>

        {/* Password strength meter */}
        {password && password.length > 0 && (
          <div className="space-y-1">
            <div className="h-1.5 w-full bg-surface-elevated rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-300',
                  passwordStrength && strengthColors[passwordStrength],
                  passwordStrength && strengthWidths[passwordStrength]
                )}
              />
            </div>
            <p className="text-xs text-text-secondary">
              Password strength:{' '}
              <span
                className={cn(
                  'font-medium',
                  passwordStrength === 'weak' && 'text-error',
                  passwordStrength === 'medium' && 'text-warning',
                  passwordStrength === 'strong' && 'text-success'
                )}
              >
                {passwordStrength}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Confirm password field */}
      <div className="space-y-2 pt-4">
        <Label htmlFor="confirmPassword" className="text-sm font-semibold text-text-primary">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            disabled={isPending}
            error={errors.confirmPassword?.message}
            className="pr-10"
            {...registerField('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-tertiary transition-colors duration-200 focus:outline-none"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <ViewOffIcon size={18} />
            ) : (
              <ViewIcon size={18} />
            )}
          </button>
        </div>
      </div>

      {/* Terms checkbox */}
      <div className="space-y-2">
        <div className="flex items-start space-x-2 py-2">
          <Controller
            name="termsAccepted"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="termsAccepted"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isPending}
                className="mt-1"
              />
            )}
          />
          <Label htmlFor="termsAccepted" className="text-sm font-normal cursor-pointer leading-relaxed">
            I accept the{' '}
            <a href="/terms" className="text-accent hover:text-accent-hover underline">
              terms and conditions
            </a>
          </Label>
        </div>
        {errors.termsAccepted && (
          <p className="text-xs text-error">{errors.termsAccepted.message}</p>
        )}
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        disabled={
          isPending ||
          isCheckingUsername ||
          (usernameCheckData && !usernameCheckData.available)
        }
        variant="primary"
        className="w-full mt-6 h-12 text-base"
      >
        {isPending ? (
          <>
            <Spinner size="sm" className="mr-2" />
            Creating account...
          </>
        ) : (
          'Create account'
        )}
      </Button>
    </form>
  )
}
