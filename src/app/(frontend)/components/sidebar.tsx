'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Atom, Sparkles, BookOpen, LayoutDashboard, Network } from 'lucide-react'
import { cn } from '@/app/(frontend)/lib/utils'

type NavItem = {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  submenu?: boolean
  active?: boolean
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Concept Graph',
    href: '/graph',
    icon: Network,
  },
  {
    title: 'Atoms',
    href: '/atoms',
    icon: Atom,
  },
  {
    title: 'Synthesized Atoms',
    href: '/synthesized',
    icon: Sparkles,
  },
  {
    title: 'Sources',
    href: '/sources',
    icon: BookOpen,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="min-h-screen w-60 bg-gray-50 border-r border-gray-200 transition-all duration-300 flex flex-col overflow-y-auto">
      {/* Sidebar header */}
      <div className="p-4 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight">
          <Network className="h-6 w-6" />
          <span>Atomizer</span>
        </Link>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 px-2 py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                )}
              >
                <item.icon
                  className={cn('h-4 w-4', isActive ? 'text-gray-900' : 'text-gray-500')}
                />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom section with app info */}
      <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-1">
            <span>Atomizer</span>
            <span className="text-gray-400">•</span>
            <span>v1.0.0</span>
          </div>
          <div>Concept Vector Explorer</div>
        </div>
      </div>
    </div>
  )
}
