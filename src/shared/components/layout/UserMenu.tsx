import { User, Settings, LogOut } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { cn } from '@/shared/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/DropdownMenu'

interface UserMenuProps {
  collapsed?: boolean
}

export const UserMenu = ({ collapsed = false }: UserMenuProps) => {
  const user = useAuthStore((state) => state.user)
  const { mutate: logout } = useLogout()

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'flex items-center w-full h-12 rounded-lg',
            'hover:bg-surface-glass transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-accent/50',
            collapsed ? 'justify-center px-0' : 'justify-start px-3'
          )}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white shrink-0">
            <User className="w-4 h-4" />
          </div>
          {!collapsed && (
            <div className="ml-3 text-left overflow-hidden">
              <p className="text-sm font-medium truncate text-text-primary">{user.username}</p>
              <p className="text-xs text-text-secondary truncate">{user.email}</p>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="right" align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-text-primary">{user.username}</p>
            <p className="text-xs text-text-secondary">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => logout()}
          className="text-error focus:text-error cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
