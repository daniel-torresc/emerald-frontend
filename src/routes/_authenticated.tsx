import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppShell } from '@/shared/components/layout/AppShell'
import { requireAuth } from '@/shared/lib/routeGuards'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    requireAuth(context, location)
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return <AppShell />
}
