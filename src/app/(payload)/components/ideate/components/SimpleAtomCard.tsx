'use client'

import React from 'react'
import { Atom } from '../actions/synthesize'
import { cn } from '@/app/(frontend)/lib/utils'

type SimpleAtomCardProps = {
  atom: Atom
  className?: string
}

export function SimpleAtomCard({ atom, className = '' }: SimpleAtomCardProps) {
  return (
    <div
      className={cn(
        'p-5 bg-card text-card-foreground rounded-xl border shadow-sm h-full flex flex-col',
        className,
      )}
    >
      {atom.title && (
        <h2 className="text-lg font-medium leading-none tracking-tight mb-3">{atom.title}</h2>
      )}

      <p className="text-sm text-card-foreground mb-4 flex-grow">{atom.mainContent}</p>

      {atom.supportingQuote && (
        <blockquote className="pl-4 border-l-2 border-primary/20 italic text-muted-foreground my-4 text-sm">
          &quot;{atom.supportingQuote}&quot;
        </blockquote>
      )}

      {atom.supportingInfo && atom.supportingInfo.length > 0 && (
        <div className="mt-2">
          <h3 className="text-xs font-medium mb-2 text-muted-foreground">Supporting Information</h3>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            {atom.supportingInfo.map((info, index) => (
              <li key={index} className="text-muted-foreground">
                {info.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {atom.source && (
        <div className="mt-3 text-xs text-muted-foreground flex items-center">
          <span className="bg-muted px-2 py-0.5 rounded text-muted-foreground">
            Source: {atom.source.title || 'Unknown'}
          </span>
        </div>
      )}
    </div>
  )
}
