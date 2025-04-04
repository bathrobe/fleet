'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '../../ui/input'
import { cn } from '../../lib/utils'
import { BaseItem } from '../../lib/types'

interface SecondaryCollectionSidebarProps {
  title: string
  items: BaseItem[]
  basePath: string
  emptyStateText?: string
  isLoading?: boolean
  onSearch?: (query: string) => void
}

export function SecondaryCollectionSidebar({
  title,
  items,
  basePath,
  emptyStateText = 'No items found',
  isLoading = false,
  onSearch,
}: SecondaryCollectionSidebarProps) {
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
    <div className="flex flex-col w-80 h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0 overflow-hidden">
      {/* Header - Fixed at top */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <h2 className="text-lg font-semibold mb-3">{title}</h2>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-10 py-2"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="mt-3 text-xs text-muted-foreground">{items.length} items</div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {isLoading ? (
          <div className="space-y-3 p-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 w-full animate-pulse rounded-md bg-muted" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-2 p-3">
            {items.map((item) => {
              const isActive = pathname === `${basePath}/${item.id}`

              return (
                <Link
                  key={item.id}
                  href={`${basePath}/${item.id}`}
                  className={cn(
                    'flex flex-col gap-2 rounded-md px-4 py-3 text-sm transition-colors',
                    isActive
                      ? 'bg-gray-100 dark:bg-gray-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-900',
                  )}
                >
                  <div className="font-medium line-clamp-1">
                    {item.title || `Untitled #${item.id}`}
                  </div>
                  {item.description && (
                    <div className="line-clamp-2 text-xs text-muted-foreground">
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
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="p-5 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
        <p className="text-xs text-muted-foreground">
          Browse {title.toLowerCase()} and select an item to view details.
        </p>
      </div>
    </div>
  )
}
