import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './Sidebar'

export const AppShell = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-7 via-green-7/30 to-orange-7/20 p-8">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
