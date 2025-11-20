import { Home, Wallet, Receipt, Upload, Settings } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useUIStore } from '@/shared/stores/uiStore'
import { cn } from '@/shared/lib/utils'
import logo from '@/assets/logo.png'

const navigation = [
  { name: 'Dashboard', to: '/', icon: Home, color: 'from-[#5C8A78] to-[#375247]', bg: 'from-[#C1E1C1] to-[#89B896]' },
  { name: 'Accounts', to: '/accounts', icon: Wallet, color: 'from-[#FF8C41] to-[#DE6B00]', bg: 'from-[#FFCFAE] to-[#FFA66A]' },
  { name: 'Transactions', to: '/transactions', icon: Receipt, color: 'from-[#507868] to-[#5C8A78]', bg: 'from-[#89B896] to-[#5C8A78]' },
  { name: 'Import', to: '/import', icon: Upload, color: 'from-[#FFA66A] to-[#FF8C41]', bg: 'from-[#FBEDDD] to-[#FFCFAE]' },
  { name: 'Settings', to: '/settings', icon: Settings, color: 'from-[#818E8F] to-[#404747]', bg: 'from-[#E3E5E8] to-[#B3C6C7]' },
]

export const Sidebar = () => {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed)

  return (
    <aside
      className={cn(
        'relative bg-white border-r-2 border-border transition-all duration-300 flex-shrink-0 shadow-lg',
        sidebarCollapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-7/30 via-transparent to-orange-7/20 pointer-events-none" />

      {/* Logo/Brand area */}
      {!sidebarCollapsed && (
        <div className="relative p-6 border-b-2 border-border">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Emerald Logo" className="h-12 w-12 object-contain" />
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Emerald
              </h2>
              <p className="text-sm text-text-tertiary font-medium">Finance Tracker</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={cn('p-4 space-y-2', sidebarCollapsed && 'pt-6')}>
        {navigation.map((item, index) => (
          <Link
            key={item.name}
            to={item.to}
            className="group relative flex items-center gap-3 px-4 py-3 rounded-2xl text-text-tertiary hover:text-text-primary transition-all duration-200"
            activeProps={{
              className: 'text-text-primary',
            }}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {({ isActive }) => (
              <>
                {/* Active background */}
                {isActive && (
                  <div className={cn(
                    'absolute inset-0 rounded-2xl bg-gradient-to-br opacity-20',
                    item.bg
                  )} />
                )}

                {/* Active indicator bar */}
                {isActive && !sidebarCollapsed && (
                  <div className={cn(
                    'absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 rounded-r-full bg-gradient-to-b shadow-lg',
                    item.color
                  )} />
                )}

                {/* Icon container with gradient background when active */}
                <div className={cn(
                  'icon-wrapper icon-wrapper-sm rounded-xl transition-all duration-200 shadow-md',
                  isActive
                    ? cn('bg-gradient-to-br shadow-lg', item.color)
                    : 'bg-gray-7 group-hover:bg-gradient-to-br group-hover:' + item.color.split(' ')[0].replace('from-', 'from-') + '/20'
                )}>
                  <item.icon
                    className={cn(
                      'icon-md transition-colors',
                      isActive ? 'text-white' : 'text-text-tertiary group-hover:text-text-secondary'
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>

                {/* Label */}
                {!sidebarCollapsed && (
                  <span className={cn(
                    'text-sm font-semibold transition-colors relative',
                    isActive && 'font-bold'
                  )}>
                    {item.name}
                  </span>
                )}

                {/* Hover effect */}
                <div className={cn(
                  'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-br',
                  item.bg.replace('from-', 'from-').replace('to-', 'to-') + '/10'
                )} />
              </>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom decoration */}
      {!sidebarCollapsed && (
        <div className="absolute bottom-6 left-6 right-6">
          <div className="p-4 bg-gradient-to-br from-green-7 to-green-6 border-2 border-green-5 rounded-2xl shadow-lg">
            <p className="text-sm font-bold text-accent-dark mb-1">Need Help?</p>
            <p className="text-xs text-green-3 font-medium">Check our documentation</p>
          </div>
        </div>
      )}
    </aside>
  )
}
