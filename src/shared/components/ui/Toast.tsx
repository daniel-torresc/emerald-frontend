import { Toaster as Sonner } from 'sonner'

export const Toaster = () => (
  <Sonner
    theme="dark"
    position="top-right"
    toastOptions={{
      style: {
        background: 'var(--color-surface-elevated)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text-primary)',
      },
      classNames: {
        error: '!bg-surface-elevated !border-error !text-error',
        success: '!bg-surface-elevated !border-success !text-success',
        warning: '!bg-surface-elevated !border-warning !text-warning',
        info: '!bg-surface-elevated !border-info !text-info',
      },
    }}
  />
)

// Export toast function for easy usage
export { toast } from 'sonner'
