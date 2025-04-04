'use client'

import React from 'react'
import Link from 'next/link'
import { Atom, Source, SynthesizedAtom } from '@/payload-types'
import { cn } from '../../lib/utils'

type RelatedItemProps = {
  id: number
  title?: string | null
  description?: string | null
  type: 'atom' | 'synthesizedAtom' | 'source'
  href: string
}

// Function to create a consistent item display
const RelatedItem = ({ item }: { item: RelatedItemProps }) => (
  <Link
    href={item.href}
    className={cn(
      'flex flex-col gap-1 rounded-md px-3 py-2 text-sm transition-colors border',
      item.type === 'atom'
        ? 'border-blue-100 hover:bg-blue-50 dark:border-blue-900 dark:hover:bg-blue-900/30'
        : item.type === 'synthesizedAtom'
          ? 'border-green-100 hover:bg-green-50 dark:border-green-900 dark:hover:bg-green-900/30'
          : 'border-purple-100 hover:bg-purple-50 dark:border-purple-900 dark:hover:bg-purple-900/30',
    )}
  >
    <div className="font-medium line-clamp-1 flex items-center gap-2">
      <span
        className={cn(
          'w-2 h-2 rounded-full',
          item.type === 'atom'
            ? 'bg-blue-500'
            : item.type === 'synthesizedAtom'
              ? 'bg-green-500'
              : 'bg-purple-500',
        )}
      />
      {item.title ||
        `${item.type === 'atom' ? 'Atom' : item.type === 'synthesizedAtom' ? 'Synthesized Atom' : 'Source'} ${item.id}`}
    </div>
    {item.description && (
      <div
        className={cn(
          'text-xs text-muted-foreground',
          // Don't truncate source summaries, but truncate others
          item.type !== 'source' && 'line-clamp-2',
        )}
      >
        {item.description}
      </div>
    )}
  </Link>
)

interface SourceSidebarProps {
  source: Source
}

export function SourceRelatedSidebar({ source }: SourceSidebarProps) {
  // Extract related atoms if populated
  const relatedAtoms = source.relatedAtoms?.docs?.filter((atom) => typeof atom !== 'number') || []
  const relatedSynthesizedAtoms =
    source.relatedSynthesizedAtoms?.filter((atom) => typeof atom !== 'number') || []

  const hasRelatedItems = relatedAtoms.length > 0 || relatedSynthesizedAtoms.length > 0

  if (!hasRelatedItems) {
    return null
  }

  return (
    <div className="w-80 border-l border-gray-200 dark:border-gray-800 p-4 overflow-y-auto">
      <h3 className="font-medium mb-4">Related Items</h3>

      <div className="space-y-4">
        {relatedAtoms.length > 0 && (
          <div>
            <h4 className="text-sm uppercase text-muted-foreground font-semibold mb-2">Atoms</h4>
            <div className="space-y-2">
              {relatedAtoms.map((atom) => (
                <RelatedItem
                  key={atom.id}
                  item={{
                    id: atom.id,
                    title: atom.title,
                    description: atom.mainContent,
                    type: 'atom',
                    href: `/atoms/${atom.id}`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {relatedSynthesizedAtoms.length > 0 && (
          <div>
            <h4 className="text-sm uppercase text-muted-foreground font-semibold mb-2">
              Synthesized Atoms
            </h4>
            <div className="space-y-2">
              {relatedSynthesizedAtoms.map((atom) => (
                <RelatedItem
                  key={atom.id}
                  item={{
                    id: atom.id,
                    title: atom.title,
                    description: atom.mainContent,
                    type: 'synthesizedAtom',
                    href: `/synthesized/${atom.id}`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface AtomSidebarProps {
  atom: Atom
}

export function AtomRelatedSidebar({ atom }: AtomSidebarProps) {
  // Get source if populated
  const source = typeof atom.source === 'number' ? null : (atom.source as Source)

  // Get synthesizedAtoms joined to this atom if populated
  // The join returns a structure with a docs array
  const synthesizedAtoms =
    atom.synthesizedAtoms && 'docs' in atom.synthesizedAtoms
      ? atom.synthesizedAtoms.docs?.filter((item) => typeof item !== 'number') || []
      : []

  const hasRelatedItems = source || synthesizedAtoms.length > 0

  if (!hasRelatedItems) {
    return null
  }

  return (
    <div className="w-80 border-l border-gray-200 dark:border-gray-800 p-4 overflow-y-auto">
      <h3 className="font-medium mb-4">Related Items</h3>

      <div className="space-y-4">
        {source && (
          <div>
            <h4 className="text-sm uppercase text-muted-foreground font-semibold mb-2">Source</h4>
            <RelatedItem
              item={{
                id: source.id,
                title: source.title,
                description: source.oneSentenceSummary || null,
                type: 'source',
                href: `/sources/${source.id}`,
              }}
            />
          </div>
        )}

        {synthesizedAtoms.length > 0 && (
          <div>
            <h4 className="text-sm uppercase text-muted-foreground font-semibold mb-2">
              Derived Synthesized Atoms
            </h4>
            <div className="space-y-2">
              {synthesizedAtoms.map((synth: SynthesizedAtom) => (
                <RelatedItem
                  key={synth.id}
                  item={{
                    id: synth.id,
                    title: synth.title,
                    description: synth.mainContent,
                    type: 'synthesizedAtom',
                    href: `/synthesized/${synth.id}`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface SynthesizedAtomSidebarProps {
  synthesizedAtom: SynthesizedAtom
}

export function SynthesizedAtomRelatedSidebar({ synthesizedAtom }: SynthesizedAtomSidebarProps) {
  // Convert parentAtoms to an array of Atom objects (if they've been populated)
  const parentAtoms = synthesizedAtom.parentAtoms
    .map((parent) => (typeof parent === 'number' ? null : (parent as Atom)))
    .filter(Boolean) as Atom[]

  if (parentAtoms.length === 0) {
    return null
  }

  return (
    <div className="w-80 border-l border-gray-200 dark:border-gray-800 p-4 overflow-y-auto">
      <h3 className="font-medium mb-4">Related Items</h3>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm uppercase text-muted-foreground font-semibold mb-2">
            Parent Atoms
          </h4>
          <div className="space-y-2">
            {parentAtoms.map((atom) => (
              <RelatedItem
                key={atom.id}
                item={{
                  id: atom.id,
                  title: atom.title,
                  description: atom.mainContent,
                  type: 'atom',
                  href: `/atoms/${atom.id}`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
