'use client'

import React, { useCallback } from 'react'
import { Database, Menu } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from '../../ui/sidebar'
import { AtomList } from './AtomList'
import { Separator } from '../../ui/separator'

type AtomSidebarProps = {
  onAtomClick: (atomId: string, pineconeId: string) => void
  selectedAtomId?: string | null
}

export function AtomSidebar({ onAtomClick, selectedAtomId }: AtomSidebarProps) {
  const { isMobile, setOpen } = useSidebar()

  // Wrap the onAtomClick callback to close the sidebar on mobile when an atom is selected
  const handleAtomClick = useCallback(
    (atomId: string, pineconeId: string) => {
      // Call the original onAtomClick
      onAtomClick(atomId, pineconeId)

      // Close the sidebar on mobile
      if (isMobile) {
        setOpen(false)
      }
    },
    [onAtomClick, isMobile, setOpen],
  )

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
          <AtomList onAtomClick={handleAtomClick} selectedAtomId={selectedAtomId} />
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
