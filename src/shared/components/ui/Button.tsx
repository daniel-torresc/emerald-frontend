import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-bold transition-all duration-200 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-accent to-accent-dark hover:from-accent-hover hover:to-green-3 text-white shadow-lg hover:shadow-lg active:scale-[0.99] rounded-xl',
        secondary:
          'bg-gradient-to-r from-secondary to-secondary-hover hover:from-orange-3 hover:to-secondary text-white shadow-lg hover:shadow-xl active:scale-[0.98] rounded-xl',
        accent:
          'bg-gradient-to-r from-accent to-accent-dark hover:from-accent-hover hover:to-green-3 text-white shadow-lg hover:shadow-lg active:scale-[0.99] rounded-xl',
        ghost: 'hover:bg-surface-glass text-text-primary hover:text-text-primary rounded-lg',
        danger: 'bg-gradient-to-r from-error to-error/90 text-white hover:shadow-lg hover:brightness-110 active:scale-[0.98] rounded-xl',
      },
      size: {
        sm: 'h-10 px-5 text-sm',
        md: 'h-12 px-6 text-[15px]',
        lg: 'h-14 px-8 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
    )
  }
)
Button.displayName = 'Button'
