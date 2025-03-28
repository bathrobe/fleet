'use client'

import React from 'react'
import { Sparkles, Link as LinkIcon, ExternalLink, Atom } from 'lucide-react'
import { cn } from '@/app/(frontend)/lib/utils'

type SynthesizedAtomDisplayMobileProps = {
  atom: any
  onFocusParentAtom?: (atomId: string, pineconeId: string, collection: string) => void
}

export function SynthesizedAtomDisplayMobile({
  atom,
  onFocusParentAtom,
}: SynthesizedAtomDisplayMobileProps) {
  if (!atom) return null

  const handleParentAtomClick = (parent: any) => {
    if (onFocusParentAtom && parent.id && parent.pineconeId) {
      onFocusParentAtom(parent.id, parent.pineconeId, 'atoms')
    }
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 overflow-y-auto">
      {/* Simplified header */}
      <div className="px-4 py-3 border-b border-green-500 dark:border-green-700 flex justify-between items-center bg-green-50 dark:bg-green-950">
        <div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              <Sparkles className="h-3 w-3 mr-1" />
              SYNTHESIS
            </div>
          </div>
        </div>

        {/* Right-aligned copy link button */}
        <button
          onClick={() => {
            // Create URL with parameters
            const url = new URL(window.location.href)
            url.searchParams.set('a', atom.id)
            url.searchParams.set('v', atom.pineconeId)
            url.searchParams.set('t', 's')

            // Copy to clipboard
            navigator.clipboard
              .writeText(url.toString())
              .then(() => alert('Link copied to clipboard'))
              .catch((err) => console.error('Failed to copy link: ', err))
          }}
          className="text-gray-500 hover:text-gray-700 text-sm px-2 py-1 rounded"
        >
          Copy Link
        </button>
      </div>

      {/* Main content with more compact layout */}
      <div className="px-4 py-3 space-y-3">
        {/* Concept title */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{atom.title}</h2>

        {/* Main content */}
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800 text-gray-800 dark:text-gray-200">
          {atom.mainContent}
        </div>

        {/* Key insights in compact form */}
        {atom.supportingInfo && atom.supportingInfo.length > 0 && (
          <div className="space-y-1">
            <h3 className="text-sm font-semibold flex items-center">
              <LinkIcon className="h-4 w-4 text-green-600 mr-1" />
              Key Insights
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-sm text-gray-700 dark:text-gray-300">
              {atom.supportingInfo.map((info: any, index: number) => (
                <li key={index}>{info.text}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Theory fiction - shortened */}
        {atom.theoryFiction && (
          <div className="space-y-1">
            <h3 className="text-sm font-semibold">Theory Fiction</h3>
            <div className="p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg border-l-4 border-green-400 text-sm italic">
              {atom.theoryFiction}
            </div>
          </div>
        )}

        {/* Parent atoms - compact version */}
        {atom.parentAtoms && atom.parentAtoms.length > 0 && (
          <div className="space-y-1">
            <h3 className="text-sm font-semibold flex items-center">
              <LinkIcon className="h-4 w-4 text-green-600 mr-1" />
              Parent Atoms
            </h3>
            <div className="space-y-2">
              {atom.parentAtoms.map((parent: any) => (
                <div
                  key={parent.id}
                  className={cn(
                    'p-2 rounded-md border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-800',
                    onFocusParentAtom && parent.pineconeId
                      ? 'cursor-pointer hover:bg-blue-100 transition-colors'
                      : '',
                  )}
                  onClick={() =>
                    onFocusParentAtom && parent.pineconeId && handleParentAtomClick(parent)
                  }
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-blue-700 dark:text-blue-400 text-sm">
                        {parent.title || `Atom ${parent.id}`}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {parent.mainContent}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
