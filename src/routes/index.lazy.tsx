import { createLazyFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { Wallet, TrendingUp, CreditCard, ArrowUpRight, Sparkles, Plus } from 'lucide-react'

export const Route = createLazyFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Welcome Header with gradient */}
      <div className="mb-10 animate-fade-in">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative icon-wrapper icon-wrapper-xs">
            <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent-light rounded-lg blur-lg opacity-50" />
            <Sparkles className="relative icon-xl text-accent" />
          </div>
          <h1 className="text-4xl font-bold text-text-primary">
            Welcome back{user?.username ? `, ${user.username}` : ''}!
          </h1>
        </div>
        <p className="text-text-secondary text-lg ml-11">
          Here's an overview of your finances at a glance.
        </p>
      </div>

      {/* Stats Cards with vibrant colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-slide-in">
        {/* Total Balance Card - Green */}
        <div className="group relative bg-gradient-to-br from-green-6 to-green-7 border-2 border-green-5 hover:border-accent p-6 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-accent/30 hover:scale-[1.02] cursor-pointer overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-5/30 to-transparent rounded-full -mr-16 -mt-16" />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="icon-wrapper icon-wrapper-md bg-gradient-to-br from-accent to-accent-dark rounded-2xl shadow-lg">
                <Wallet className="icon-sm text-white" strokeWidth={2.5} />
              </div>
              <div className="flex items-center gap-1 text-accent-dark text-sm font-bold bg-white/80 px-2 py-1 rounded-lg">
                <ArrowUpRight className="icon-xs" />
                <span>0%</span>
              </div>
            </div>
            <h2 className="text-sm font-bold text-accent-dark mb-2 uppercase tracking-wider">
              Total Balance
            </h2>
            <p className="text-4xl font-bold text-green-1 mb-1">$0.00</p>
            <p className="text-sm text-green-3 font-medium">Across all accounts</p>
          </div>
        </div>

        {/* This Month Card - Orange */}
        <div className="group relative bg-gradient-to-br from-orange-6 to-orange-7 border-2 border-orange-4 hover:border-secondary p-6 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-secondary/30 hover:scale-[1.02] cursor-pointer overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/30 to-transparent rounded-full -mr-16 -mt-16" />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="icon-wrapper icon-wrapper-md bg-gradient-to-br from-secondary to-secondary-hover rounded-2xl shadow-lg">
                <TrendingUp className="icon-sm text-white" strokeWidth={2.5} />
              </div>
              <div className="flex items-center gap-1 text-orange-1 text-sm font-bold bg-white/80 px-2 py-1 rounded-lg">
                <span>—</span>
              </div>
            </div>
            <h2 className="text-sm font-bold text-orange-1 mb-2 uppercase tracking-wider">
              This Month
            </h2>
            <p className="text-4xl font-bold text-orange-1 mb-1">$0.00</p>
            <p className="text-sm text-orange-2 font-medium">Total spending</p>
          </div>
        </div>

        {/* Accounts Card - Mixed */}
        <div className="group relative bg-gradient-to-br from-gray-6 to-gray-7 border-2 border-gray-5 hover:border-accent p-6 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-gray-3/30 hover:scale-[1.02] cursor-pointer overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-3/20 to-transparent rounded-full -mr-16 -mt-16" />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="icon-wrapper icon-wrapper-md bg-gradient-to-br from-green-3 to-accent rounded-2xl shadow-lg">
                <CreditCard className="icon-sm text-white" strokeWidth={2.5} />
              </div>
              <button className="icon-wrapper icon-wrapper-xs bg-accent-light hover:bg-accent rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-110 active:scale-95">
                <Plus className="icon-sm text-white" strokeWidth={3} />
              </button>
            </div>
            <h2 className="text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">
              Accounts
            </h2>
            <p className="text-4xl font-bold text-text-primary mb-1">0</p>
            <p className="text-sm text-text-tertiary font-medium">Active accounts</p>
          </div>
        </div>
      </div>

      {/* Getting Started Section - colorful */}
      <div className="relative bg-white border-2 border-border rounded-3xl p-8 overflow-hidden animate-fade-in shadow-xl [animation-delay:0.1s]">
        {/* Decorative gradient orb */}
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-gradient-to-br from-accent-light/20 to-secondary/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="icon-wrapper icon-wrapper-lg bg-gradient-to-br from-accent to-accent-light rounded-2xl shadow-lg">
              <Sparkles className="icon-lg text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-bold text-text-primary">Getting Started</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="group p-6 bg-gradient-to-br from-green-7 to-white border-2 border-green-6 hover:border-accent rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="icon-wrapper icon-wrapper-sm bg-gradient-to-br from-accent to-accent-dark rounded-xl shadow-md group-hover:shadow-lg transition-shadow">
                  <Plus className="icon-md text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-text-primary mb-1">Add Account</h3>
                  <p className="text-sm text-green-3 font-medium">Start tracking your finances by adding your first account</p>
                </div>
              </div>
            </div>

            <div className="group p-6 bg-gradient-to-br from-orange-7 to-white border-2 border-orange-6 hover:border-secondary rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="icon-wrapper icon-wrapper-sm bg-gradient-to-br from-secondary to-secondary-hover rounded-xl shadow-md group-hover:shadow-lg transition-shadow">
                  <TrendingUp className="icon-md text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-text-primary mb-1">Import Transactions</h3>
                  <p className="text-sm text-orange-2 font-medium">Upload CSV files to quickly populate your transaction history</p>
                </div>
              </div>
            </div>

            <div className="group p-6 bg-gradient-to-br from-gray-6 to-white border-2 border-gray-5 hover:border-gray-3 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="icon-wrapper icon-wrapper-sm bg-gradient-to-br from-gray-3 to-gray-2 rounded-xl shadow-md group-hover:shadow-lg transition-shadow">
                  <Sparkles className="icon-md text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-text-primary mb-1">Set Up Categories</h3>
                  <p className="text-sm text-text-tertiary font-medium">Organize your spending with custom categories</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
