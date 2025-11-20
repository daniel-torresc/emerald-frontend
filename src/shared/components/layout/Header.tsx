import { Menu, Sparkles, Bell, Search } from 'lucide-react'
import { UserMenu } from './UserMenu'
import { useUIStore } from '@/shared/stores/uiStore'
import logo from '@/assets/logo.png'

export const Header = () => {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)

  return (
    <header className="relative h-16 bg-white border-b-2 border-border px-6 flex items-center justify-between flex-shrink-0 shadow-sm">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-7/30 via-transparent to-orange-7/30 pointer-events-none" />

      <div className="relative flex items-center gap-4 z-10">
        <button
          onClick={toggleSidebar}
          className="icon-wrapper icon-wrapper-sm hover:bg-green-7 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 hover:scale-105 active:scale-95 shadow-sm"
          aria-label="Toggle sidebar"
        >
          <Menu className="icon-md text-text-secondary group-hover:text-accent transition-colors" strokeWidth={2} />
        </button>

        {/* Logo */}
        <img src={logo} alt="Emerald Logo" className="h-12 w-12 object-contain" />

        {/* Search bar - colorful and elegant */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-7 border-2 border-border rounded-xl hover:border-accent transition-all duration-200 min-w-[320px] group shadow-sm">
          <Search className="icon-sm text-text-muted group-hover:text-accent transition-colors" />
          <input
            type="text"
            placeholder="Search transactions, accounts..."
            className="bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-muted w-full font-medium"
          />
          <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-border rounded text-xs text-text-tertiary font-semibold">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="relative flex items-center gap-3 z-10">
        {/* Notifications */}
        <button className="relative icon-wrapper icon-wrapper-sm hover:bg-orange-7 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm">
          <Bell className="icon-md text-text-tertiary group-hover:text-secondary transition-colors" strokeWidth={2} />
          {/* Notification badge */}
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-secondary rounded-full animate-pulse shadow-md" />
        </button>

        {/* Quick action button */}
        <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-accent to-accent-dark hover:from-green-3 hover:to-accent text-white rounded-xl transition-all duration-200 hover:shadow-xl hover:scale-105 active:scale-95 font-bold text-sm shadow-lg">
          <Sparkles className="icon-sm" strokeWidth={2.5} />
          <span>New Transaction</span>
        </button>

        <UserMenu />
      </div>
    </header>
  )
}
