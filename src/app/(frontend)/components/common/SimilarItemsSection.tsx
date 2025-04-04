'use client'

import React from 'react'
import Link from 'next/link'
import { Atom, SynthesizedAtom } from '@/payload-types'
import { cn } from '../../lib/utils'

type ItemType = Atom | SynthesizedAtom
type ItemDisplay = {
  id: number
  title?: string | null
  description?: string | null
  type: 'atom' | 'synthesizedAtom'
  href: string
}

interface SimilarItemCardProps {
  item: ItemDisplay
}

const SimilarItemCard: React.FC<SimilarItemCardProps> = ({ item }) => (
  <Link
    href={item.href}
    className={cn(
      'basis-72 flex-grow p-5 m-2 rounded-md border transition-colors',
      item.type === 'atom'
        ? 'border-blue-100 hover:bg-blue-50 dark:border-blue-900 dark:hover:bg-blue-900/30'
        : 'border-green-100 hover:bg-green-50 dark:border-green-900 dark:hover:bg-green-900/30',
    )}
  >
    <div className="flex items-center gap-2 mb-3">
      <span
        className={cn(
          'w-3 h-3 rounded-full',
          item.type === 'atom' ? 'bg-blue-500' : 'bg-green-500',
        )}
      />
      <h3 className="font-medium truncate text-base">
        {item.title || `${item.type === 'atom' ? 'Atom' : 'Synthesized Atom'} ${item.id}`}
      </h3>
    </div>
    {item.description && (
      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
        {item.description}
      </p>
    )}
  </Link>
)

interface SimilarItemsSectionProps {
  title: string
  items: ItemType[]
  itemType: 'atom' | 'synthesizedAtom'
}

export function SimilarItemsSection({ title, items, itemType }: SimilarItemsSectionProps) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className="mt-10 max-w-4xl mx-auto p-6 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-semibold mb-5">{title}</h2>
      <div className="flex flex-wrap -m-2">
        {items.map((item) => (
          <SimilarItemCard
            key={item.id}
            item={{
              id: item.id,
              title: item.title,
              description:
                itemType === 'atom'
                  ? (item as Atom).mainContent
                  : (item as SynthesizedAtom).mainContent,
              type: itemType,
              href: `/${itemType === 'atom' ? 'atoms' : 'synthesized'}/${item.id}`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
