'use client'

import React, { useState, useEffect } from 'react'
import { AtomIcon, Loader2 } from 'lucide-react'
import { SidebarSection, SidebarItem } from '../ui/sidebar'
import { getPayload } from 'payload'
import { AtomData } from '../ConceptGraph/fetchVectors'

type AtomListProps = {
  onAtomClick: (atomId: string, pineconeId: string) => void
  selectedAtomId?: string | null
}

export function AtomList({ onAtomClick, selectedAtomId }: AtomListProps) {
  const [atoms, setAtoms] = useState<Array<{ id: string; title: string; pineconeId: string }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAtoms = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch atoms from the API
        const response = await fetch('/api/atoms?limit=100')
        const data = await response.json()

        if (data.docs && Array.isArray(data.docs)) {
          // Extract just the id, title and pineconeId
          const atomList = data.docs.map((atom: any) => ({
            id: atom.id,
            title: atom.title || 'Untitled Atom',
            pineconeId: atom.pineconeId || '',
          }))

          setAtoms(atomList)
        } else {
          throw new Error('Invalid response format')
        }
      } catch (err) {
        console.error('Failed to load atoms:', err)
        setError('Failed to load atoms')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAtoms()
  }, [])

  if (isLoading) {
    return (
      <SidebarSection>
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </SidebarSection>
    )
  }

  if (error) {
    return (
      <SidebarSection>
        <div className="px-4 py-4 text-red-500 text-sm">{error}</div>
      </SidebarSection>
    )
  }

  if (atoms.length === 0) {
    return (
      <SidebarSection>
        <div className="px-4 py-4 text-gray-500 text-sm">No atoms found</div>
      </SidebarSection>
    )
  }

  return (
    <SidebarSection title="Atoms">
      <div className="space-y-0.5">
        {atoms.map((atom) => (
          <SidebarItem
            key={atom.id}
            active={selectedAtomId === atom.id}
            onClick={() => atom.pineconeId && onAtomClick(atom.id, atom.pineconeId)}
          >
            <div className="flex items-center space-x-2 truncate w-full">
              <AtomIcon className="h-4 w-4 shrink-0 text-gray-500" />
              <span className="truncate">{atom.title}</span>
            </div>
          </SidebarItem>
        ))}
      </div>
    </SidebarSection>
  )
}
