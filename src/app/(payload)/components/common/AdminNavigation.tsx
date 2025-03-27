'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/app/(frontend)/lib/utils'
import { FileUp, Sparkles } from 'lucide-react'

type NavItem = {
  label: string
  path: string
  icon: React.ReactNode
}

export const AdminNavigation = () => {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      label: 'Source Uploader',
      path: '/admin/source-uploader',
      icon: <FileUp className="h-4 w-4" />,
    },
    {
      label: 'Ideate',
      path: '/admin/ideate',
      icon: <Sparkles className="h-4 w-4" />,
    },
  ]

  return (
    <div className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex items-center px-4 py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-slate-700',
                pathname === item.path
                  ? 'text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary'
                  : 'text-slate-600 dark:text-slate-300',
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
