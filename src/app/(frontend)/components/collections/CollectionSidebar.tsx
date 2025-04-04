'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarInput,
} from '@/app/(frontend)/ui/sidebar'
import { Input } from '@/app/(frontend)/ui/input'
import { cn } from '@/app/(frontend)/lib/utils'
import { BaseItem } from '@/app/(frontend)/lib/types'

interface CollectionSidebarProps {
  title: string
  items: BaseItem[]
  basePath: string
  emptyStateText?: string
  side?: 'left' | 'right'
  isLoading?: boolean
  onSearch?: (query: string) => void
}

export function CollectionSidebar({
  title,
  items,
  basePath,
  emptyStateText = 'No items found',
  side = 'left',
  isLoading = false,
  onSearch,
}: CollectionSidebarProps) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    if (onSearch) {
      onSearch(query)
    }
  }

  return (
    <Sidebar side={side} className="border-r">
      <SidebarHeader>
        <div className="flex items-center justify-between py-2">
          <h2 className="px-2 text-lg font-semibold">{title}</h2>
          <div className="text-xs text-muted-foreground">{items.length} items</div>
        </div>
        <div className="px-2 pb-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {isLoading ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 w-full animate-pulse rounded-md bg-muted" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-1 p-2">
            {items.map((item) => {
              const isActive = pathname === `${basePath}/${item.id}`

              return (
                <Link
                  key={item.id}
                  href={`${basePath}/${item.id}`}
                  className={cn(
                    'flex flex-col gap-1 rounded-md px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-gray-100 dark:bg-gray-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-900',
                  )}
                >
                  <div className="font-medium">{item.title || `Untitled #${item.id}`}</div>
                  {item.description && (
                    <div className="line-clamp-1 text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-sm text-muted-foreground">{emptyStateText}</p>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground">
          <p>Browse {title.toLowerCase()} and select an item to view details.</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
