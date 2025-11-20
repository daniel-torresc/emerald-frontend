import { Home, Wallet, Receipt, Upload, Settings } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useUIStore } from '@/shared/stores/uiStore'
import { cn } from '@/shared/lib/utils'
import { UserMenu } from './UserMenu'
import logo from '@/assets/logo.png'
import { useState, useRef, useEffect } from 'react'

const navigation = [
  { name: 'Dashboard', to: '/', icon: Home },
  { name: 'Accounts', to: '/accounts', icon: Wallet },
  { name: 'Transactions', to: '/transactions', icon: Receipt },
  { name: 'Import', to: '/import', icon: Upload },
  { name: 'Settings', to: '/settings', icon: Settings },
]

export const Sidebar = () => {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed)
  const sidebarWidth = useUIStore((state) => state.sidebarWidth)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const setSidebarWidth = useUIStore((state) => state.setSidebarWidth)
  const setSidebarCollapsed = useUIStore((state) => state.setSidebarCollapsed)

  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return

      const newWidth = e.clientX

      // If dragging below 100px, collapse the sidebar
      if (newWidth < 100) {
        setSidebarCollapsed(true)
      } else {
        // If currently collapsed and dragging above 100px, expand it
        if (sidebarCollapsed) {
          setSidebarCollapsed(false)
        }
        setSidebarWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    if (isResizing) {
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, setSidebarWidth, sidebarCollapsed, setSidebarCollapsed])

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        'group relative bg-white border-r-2 border-border flex flex-col h-screen',
        sidebarCollapsed ? 'w-20' : '',
        !isResizing && 'transition-all duration-300 ease-in-out'
      )}
      style={!sidebarCollapsed ? { width: `${sidebarWidth}px` } : undefined}
    >
      {/* Logo/Brand area - Clickable to toggle sidebar */}
      <button
        onClick={toggleSidebar}
        className={cn(
          'flex items-center p-6 border-b-2 border-border h-[100px] w-full',
          'transition-colors hover:bg-surface-glass cursor-pointer',
          sidebarCollapsed ? 'justify-center' : 'justify-start'
        )}
        aria-label="Toggle sidebar"
      >
        <img src={logo} alt="Emerald Logo" className="h-12 w-12 object-contain shrink-0" />
        {!sidebarCollapsed && (
          <div className="ml-3 min-w-0 flex-1 text-left">
            <h2 className="text-xl font-bold text-text-primary truncate">
              Emerald
            </h2>
            <p className="text-sm text-text-tertiary font-medium truncate">Finance Tracker</p>
          </div>
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.to}
            className={cn(
              'group relative flex items-center h-12 rounded-lg',
              'transition-all duration-200',
              sidebarCollapsed ? 'justify-center px-0' : 'justify-start px-3 hover:translate-x-2'
            )}
            activeProps={{
              className: 'bg-surface-glass',
            }}
          >
            {({ isActive }) => (
              <>
                {/* Left marker for active item */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full" />
                )}

                {/* Icon wrapper with fixed width to prevent shifts */}
                <div className="flex items-center justify-center w-6 h-6 shrink-0">
                  <item.icon
                    className={cn(
                      'w-5 h-5 transition-colors',
                      isActive ? 'text-accent' : 'text-text-tertiary group-hover:text-text-primary'
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>

                {/* Label */}
                {!sidebarCollapsed && (
                  <span className={cn(
                    'ml-3 text-sm font-semibold transition-colors truncate',
                    isActive ? 'text-accent font-bold' : 'text-text-tertiary group-hover:text-text-primary'
                  )}>
                    {item.name}
                  </span>
                )}
              </>
            )}
          </Link>
        ))}
      </nav>

      {/* User Profile - Bottom of Sidebar */}
      <div className="border-t-2 border-border p-4">
        <UserMenu collapsed={sidebarCollapsed} />
      </div>

      {/* Resize Handle - Always visible to allow uncollapsing */}
      <div
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-accent/30 transition-colors group/resize"
        onMouseDown={handleResizeStart}
      >
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-1 h-16 bg-accent/0 group-hover/resize:bg-accent/50 transition-colors rounded-l-full" />
      </div>
    </aside>
  )
}
