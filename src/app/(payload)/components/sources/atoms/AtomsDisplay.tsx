'use client'

import React from 'react'

interface AtomDisplayProps {
  atoms: any[]
}

export const AtomsDisplay = ({ atoms }: AtomDisplayProps) => {
  if (!atoms || atoms.length === 0) return null

  return (
    <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
      <h3 className="m-0 mb-4 text-blue-300 text-lg border-b border-slate-700 pb-2">
        {atoms.length} Atoms Generated
      </h3>

      <div className="max-h-[500px] overflow-y-auto pr-2">
        {atoms.map((atom, index) => (
          <div key={index} className="mb-4 p-3 bg-slate-800 rounded border border-slate-700">
            <div className="font-bold mb-2 text-blue-100 text-sm">{atom.title}</div>
            <div className="mb-2 text-sm text-slate-100">{atom.mainContent}</div>
            <div className="mt-2 text-xs text-blue-200 italic border-l-2 border-slate-600 pl-2">
              &ldquo;{atom.supportingQuote}&rdquo;
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
