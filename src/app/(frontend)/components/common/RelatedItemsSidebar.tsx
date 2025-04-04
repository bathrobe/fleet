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
      'flex flex-col gap-2 rounded-md px-4 py-3 text-sm transition-colors border',
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
      <div className="text-xs text-muted-foreground leading-relaxed">{item.description}</div>
    )}
  </Link>
)

interface SourceSidebarProps {
  source: Source
  similarSources?: Source[] // Add similar sources property
}

export function SourceRelatedSidebar({ source, similarSources = [] }: SourceSidebarProps) {
  // Extract related atoms if populated
  const relatedAtoms = source.relatedAtoms?.docs?.filter((atom) => typeof atom !== 'number') || []
  const relatedSynthesizedAtoms =
    source.relatedSynthesizedAtoms?.filter((atom) => typeof atom !== 'number') || []

  const hasRelatedItems =
    relatedAtoms.length > 0 || relatedSynthesizedAtoms.length > 0 || similarSources.length > 0

  if (!hasRelatedItems) {
    return null
  }

  return (
    <div className="w-96 border-l border-gray-200 dark:border-gray-800 p-6 overflow-y-auto">
      <h3 className="font-medium mb-4">Related Items</h3>

      <div className="space-y-4">
        {similarSources.length > 0 && (
          <div>
            <h4 className="text-sm uppercase text-muted-foreground font-semibold mb-2">
              Similar Sources
            </h4>
            <div className="space-y-2">
              {similarSources.map((similarSource) => (
                <RelatedItem
                  key={similarSource.id}
                  item={{
                    id: similarSource.id,
                    title: similarSource.title,
                    description: similarSource.oneSentenceSummary || null,
                    type: 'source',
                    href: `/sources/${similarSource.id}`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

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
  siblingAtoms?: Atom[] // Atoms from the same source
  similarAtoms?: Atom[] // Similar atoms by vector similarity
}

export function AtomRelatedSidebar({
  atom,
  siblingAtoms = [],
  similarAtoms = [],
}: AtomSidebarProps) {
  // Get source if populated
  const source = typeof atom.source === 'number' ? null : (atom.source as Source)

  // Get synthesizedAtoms joined to this atom if populated
  // The join returns a structure with a docs array
  const synthesizedAtoms =
    atom.synthesizedAtoms && 'docs' in atom.synthesizedAtoms
      ? atom.synthesizedAtoms.docs?.filter((item) => typeof item !== 'number') || []
      : []

  const hasRelatedItems =
    source || synthesizedAtoms.length > 0 || siblingAtoms.length > 0 || similarAtoms.length > 0

  if (!hasRelatedItems) {
    return null
  }

  return (
    <div className="w-96 border-l border-gray-200 dark:border-gray-800 p-6 overflow-y-auto">
      <h3 className="font-medium mb-4">Related Items</h3>

      <div className="space-y-5">
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

        {siblingAtoms.length > 0 && (
          <div>
            <h4 className="text-sm uppercase text-muted-foreground font-semibold mb-2">
              Other Atoms From Same Source
            </h4>
            <div className="space-y-2">
              {siblingAtoms.map((siblingAtom: Atom) => (
                <RelatedItem
                  key={siblingAtom.id}
                  item={{
                    id: siblingAtom.id,
                    title: siblingAtom.title,
                    description: siblingAtom.mainContent,
                    type: 'atom',
                    href: `/atoms/${siblingAtom.id}`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {similarAtoms.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <h4 className="text-sm uppercase text-muted-foreground font-semibold mb-2">
              Semantically Similar Atoms
            </h4>
            <div className="space-y-2">
              {similarAtoms.map((similarAtom) => (
                <RelatedItem
                  key={similarAtom.id}
                  item={{
                    id: similarAtom.id,
                    title: similarAtom.title,
                    description: similarAtom.mainContent,
                    type: 'atom',
                    href: `/atoms/${similarAtom.id}`,
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
  similarItems?: Array<(Atom | SynthesizedAtom) & { itemType: 'atom' | 'synthesizedAtom' }>
}

export function SynthesizedAtomRelatedSidebar({
  synthesizedAtom,
  similarItems = [],
}: SynthesizedAtomSidebarProps) {
  // Convert parentAtoms to an array of Atom objects (if they've been populated)
  const parentAtoms = synthesizedAtom.parentAtoms
    .map((parent) => (typeof parent === 'number' ? null : (parent as Atom)))
    .filter(Boolean) as Atom[]

  if (parentAtoms.length === 0 && similarItems.length === 0) {
    return null
  }

  return (
    <div className="w-96 border-l border-gray-200 dark:border-gray-800 p-6 overflow-y-auto">
      <h3 className="font-medium mb-4">Related Items</h3>

      <div className="space-y-6">
        {parentAtoms.length > 0 && (
          <div>
            <h4 className="text-sm uppercase bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 font-semibold mb-3 p-2 rounded-md border border-blue-200 dark:border-blue-800">
              Parent Atoms
            </h4>
            <div className="space-y-3">
              {parentAtoms.map((atom) => (
                <div key={atom.id} className="border-l-4 border-blue-400 dark:border-blue-600 pl-3">
                  <RelatedItem
                    item={{
                      id: atom.id,
                      title: atom.title,
                      description: atom.mainContent,
                      type: 'atom',
                      href: `/atoms/${atom.id}`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {similarItems.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <h4 className="text-sm uppercase text-muted-foreground font-semibold mb-2">
              Semantically Similar Items
            </h4>
            <div className="space-y-2">
              {similarItems.map((item) => (
                <RelatedItem
                  key={`${item.itemType}-${item.id}`}
                  item={{
                    id: item.id,
                    title: item.title,
                    description: item.mainContent,
                    type: item.itemType,
                    href: `/${item.itemType === 'atom' ? 'atoms' : 'synthesized'}/${item.id}`,
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
