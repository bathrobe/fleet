'use client'

import React from 'react'
import { SidebarTrigger, SidebarInset } from '@/app/(frontend)/ui/sidebar'
import { CollectionSidebar } from './CollectionSidebar'
import { BaseItem } from '@/app/(frontend)/lib/types'

interface CollectionLayoutProps {
  title: string
  items: BaseItem[]
  basePath: string
  children: React.ReactNode
  emptyStateText?: string
  isLoading?: boolean
  onSearch?: (query: string) => void
}

export function CollectionLayout({
  title,
  items,
  basePath,
  children,
  emptyStateText,
  isLoading = false,
  onSearch,
}: CollectionLayoutProps) {
  return (
    <div className="flex h-screen">
      <CollectionSidebar
        title={title}
        items={items}
        basePath={basePath}
        emptyStateText={emptyStateText}
        isLoading={isLoading}
        onSearch={onSearch}
      />

      <SidebarInset>
        <header className="flex h-14 items-center border-b px-4">
          <SidebarTrigger className="mr-4" />
          <h1 className="text-lg font-semibold">{title}</h1>
        </header>

        <main className="flex-1 overflow-auto p-4">{children}</main>
      </SidebarInset>
    </div>
  )
}
