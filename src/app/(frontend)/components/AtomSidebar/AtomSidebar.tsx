'use client'

import React from 'react'
import { Database, Menu } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
} from '../ui/sidebar'
import { AtomList } from './AtomList'
import { Separator } from '../ui/separator'

type AtomSidebarProps = {
  onAtomClick: (atomId: string, pineconeId: string) => void
  selectedAtomId?: string | null
}

export function AtomSidebar({ onAtomClick, selectedAtomId }: AtomSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-blue-500" />
          <h1 className="text-lg font-semibold">Knowledge Base</h1>
          <div className="ml-auto">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <div className="py-2">
          <AtomList onAtomClick={onAtomClick} selectedAtomId={selectedAtomId} />
        </div>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center text-xs text-gray-500">
          <span>{selectedAtomId ? '1 atom selected' : 'No selection'}</span>
          <Separator orientation="vertical" className="mx-2 h-3" />
          <span className="ml-auto">Fleet</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
