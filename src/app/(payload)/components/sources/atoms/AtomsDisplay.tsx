'use client'

import React from 'react'

interface AtomDisplayProps {
  atoms: any[]
}

export const AtomsDisplay = ({ atoms }: AtomDisplayProps) => {
  if (!atoms || atoms.length === 0) return null

  return (
    <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
      <h3 className="m-0 mb-4 text-primary text-lg border-b border-border pb-2">
        {atoms.length} Atoms Generated
      </h3>

      <div className="max-h-[500px] overflow-y-auto pr-2">
        {atoms.map((atom, index) => (
          <div key={index} className="mb-4 p-3 bg-card rounded border border-border">
            <div className="font-bold mb-2 text-primary text-sm">{atom.title}</div>
            <div className="mb-2 text-sm text-foreground">{atom.mainContent}</div>
            <div className="mt-2 text-xs text-muted-foreground italic border-l-2 border-muted pl-2">
              &ldquo;{atom.supportingQuote}&rdquo;
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
