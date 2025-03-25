'use client'

import React from 'react'
import { Atom } from '@/app/(frontend)/lib/atoms'
import { cn } from '@/app/(frontend)/lib/utils'

type SynthesizedAtomCardProps = {
  atom: Atom
  className?: string
}

export function SynthesizedAtomCard({ atom, className = '' }: SynthesizedAtomCardProps) {
  return (
    <div
      className={cn(`p-5 rounded-lg shadow h-full flex flex-col`, className)}
      style={{
        background: 'white',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg h-full flex flex-col">
        <div className="mb-2 flex items-center">
          <div className="mr-2 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded">
            SYNTHESIS
          </div>
          {atom.title && <h2 className="text-xl font-semibold">{atom.title}</h2>}
        </div>

        <p className="text-gray-700 dark:text-gray-200 mb-4 flex-grow">{atom.mainContent}</p>

        {atom.supportingQuote && (
          <blockquote className="pl-4 border-l-4 border-purple-300 dark:border-purple-600 italic text-gray-600 dark:text-gray-400 my-4">
            &quot;{atom.supportingQuote}&quot;
          </blockquote>
        )}

        {atom.supportingInfo && atom.supportingInfo.length > 0 && (
          <div className="mt-2">
            <h3 className="text-sm font-medium mb-1">Key Insights</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {atom.supportingInfo.map((info, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">
                  {info.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
