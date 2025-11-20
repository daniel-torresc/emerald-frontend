import { createFileRoute, redirect } from '@tanstack/react-router'
import { AppShell } from '@/shared/components/layout/AppShell'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  return <AppShell />
}
