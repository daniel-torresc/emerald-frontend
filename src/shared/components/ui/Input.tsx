import { forwardRef } from 'react'
import { cn } from '@/shared/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | undefined
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          {/* Subtle glow effect on focus */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-accent/20 to-accent-dark/20 opacity-0 blur-xl transition-opacity duration-300 peer-focus:opacity-100 pointer-events-none" />

          <input
            type={type}
            className={cn(
              'peer relative flex h-12 w-full rounded-lg border border-border/50 bg-surface-glass/40 backdrop-blur-sm',
              'px-4 py-3 text-[15px] font-medium text-text-primary placeholder:text-text-muted placeholder:font-normal',
              'focus:outline-none focus:border-accent focus:bg-surface-glass/60 focus:ring-2 focus:ring-accent/20 focus:shadow-lg focus:shadow-accent/10',
              'transition-all duration-200 ease-out',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'hover:border-border-hover hover:bg-surface-glass/50 hover:shadow-sm',
              error && 'border-error/70 focus:border-error focus:ring-error/20 focus:shadow-error/10',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>

        {error && (
          <p className="text-xs text-error mt-2 font-semibold flex items-center gap-1.5 animate-slide-in" role="alert">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
