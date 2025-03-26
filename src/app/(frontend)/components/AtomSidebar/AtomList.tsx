'use client'

import React, { useState, useEffect } from 'react'
import { Atom, CircleOff, Loader2, Shapes } from 'lucide-react'
import { SidebarSection, SidebarItem } from '../../ui/sidebar'
import { getAtoms, getSynthesizedAtoms } from '@/app/(frontend)/actions/atoms'
import { cn } from '@/app/(frontend)/lib/utils'

type AtomListProps = {
  onAtomClick: (atomId: string, pineconeId: string, collection: string) => void
  selectedAtomId?: string | null
}

type AtomType = {
  id: string
  title: string
  pineconeId: string
  isSynthesized: boolean
  collection: 'atoms' | 'synthesizedAtoms'
}

export function AtomList({ onAtomClick, selectedAtomId }: AtomListProps) {
  const [atoms, setAtoms] = useState<AtomType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllAtoms = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch regular atoms
        const regularAtomsData = await getAtoms(100, 1)
        const regularAtoms =
          regularAtomsData.docs?.map((atom: any) => ({
            id: atom.id,
            title: atom.title || 'Untitled Atom',
            pineconeId: atom.pineconeId || '',
            isSynthesized: false,
            collection: 'atoms' as const,
          })) || []

        // Fetch synthesized atoms
        const synthesizedAtomsData = await getSynthesizedAtoms(100, 1)
        const synthesizedAtoms =
          synthesizedAtomsData.docs?.map((atom: any) => ({
            id: atom.id,
            title: atom.title || 'Untitled Synthesized Atom',
            pineconeId: atom.pineconeId || '',
            isSynthesized: true,
            collection: 'synthesizedAtoms' as const,
          })) || []

        // Combine and sort by title
        const allAtoms = [...regularAtoms, ...synthesizedAtoms].sort((a, b) =>
          a.title.localeCompare(b.title),
        )

        setAtoms(allAtoms)
      } catch (err) {
        console.error('Failed to load atoms:', err)
        setError('Failed to load atoms')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllAtoms()
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
        <div className="px-4 py-4 text-gray-500 text-sm flex items-center gap-2">
          <CircleOff className="w-4 h-4" /> No atoms found
        </div>
      </SidebarSection>
    )
  }

  return (
    <SidebarSection title="Atoms">
      <div className="space-y-0.5">
        {atoms.map((atom) => (
          <button
            key={`${atom.collection}-${atom.id}`}
            className={cn(
              'flex items-center w-full px-2 py-1.5 text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-800',
              atom.id === selectedAtomId && 'bg-gray-100 dark:bg-gray-800',
            )}
            onClick={() => onAtomClick(atom.id, atom.pineconeId, atom.collection)}
          >
            {atom.isSynthesized ? (
              <Shapes className="w-4 h-4 mr-2 text-emerald-500" />
            ) : (
              <Atom className="w-4 h-4 mr-2 text-blue-500" />
            )}
            <span className="truncate">{atom.title}</span>
          </button>
        ))}
      </div>
    </SidebarSection>
  )
}
