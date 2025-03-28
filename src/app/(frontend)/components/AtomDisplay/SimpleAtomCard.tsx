'use client'

import React from 'react'
import { Atom } from '@/app/(frontend)/lib/atoms'

type SimpleAtomCardProps = {
  atom: Atom
  className?: string
}

export function SimpleAtomCard({ atom, className = '' }: SimpleAtomCardProps) {
  return (
    <div
      className={`p-4 bg-white dark:bg-slate-800 rounded-lg shadow h-full flex flex-col ${className}`}
    >
      {atom.title && (
        <h2 className="text-xl font-semibold mb-2">
          <a
            href={`/atoms/${atom.id}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {atom.title}
          </a>
        </h2>
      )}

      <p className="text-gray-700 dark:text-gray-200 mb-4 flex-grow">{atom.mainContent}</p>

      {atom.supportingQuote && (
        <blockquote className="pl-4 border-l-4 border-gray-300 dark:border-gray-600 italic text-gray-600 dark:text-gray-400 my-4">
          &quot;{atom.supportingQuote}&quot;
        </blockquote>
      )}

      {atom.supportingInfo && atom.supportingInfo.length > 0 && (
        <div className="mt-2">
          <h3 className="text-sm font-medium mb-1">Supporting Information</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {atom.supportingInfo.map((info, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">
                {info.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {atom.source && (
        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Source: {atom.source.title || 'Unknown'}
        </div>
      )}
    </div>
  )
}
