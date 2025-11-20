import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-text-primary mb-4">Settings</h1>
      <p className="text-text-secondary">Settings page coming soon...</p>
    </div>
  )
}
