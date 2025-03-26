'use client'

import React, { useCallback } from 'react'
import { Database, Menu } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from '../../ui/sidebar'
import { AtomList } from './AtomList'

type AtomSidebarProps = {
  onAtomClick: (atomId: string, pineconeId: string, collection: string) => void
  selectedAtomId?: string | null
}

export function AtomSidebar({ onAtomClick, selectedAtomId }: AtomSidebarProps) {
  const { isMobile, setOpen } = useSidebar()

  // Wrap the onAtomClick callback to close the sidebar on mobile when an atom is selected
  const handleAtomClick = useCallback(
    (atomId: string, pineconeId: string, collection: string) => {
      // Call the original onAtomClick
      onAtomClick(atomId, pineconeId, collection)

      // Close the sidebar on mobile
      if (isMobile) {
        setOpen(false)
      }
    },
    [onAtomClick, isMobile, setOpen],
  )

  return (
    <Sidebar className="h-screen">
      <SidebarHeader>
        <div className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-blue-500" />
          <h1 className="text-lg font-semibold">Knowledge Base</h1>
          <div className="ml-auto">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="h-full overflow-y-auto">
        <div className="py-2">
          <AtomList onAtomClick={handleAtomClick} selectedAtomId={selectedAtomId} />
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
