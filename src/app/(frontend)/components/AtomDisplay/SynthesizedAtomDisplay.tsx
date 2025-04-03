'use client'

import React from 'react'
import { CardContent, CardHeader, CardTitle } from '@/app/ui/card'
import { Badge } from '@/app/ui/badge'
import { Button } from '@/app/ui/button'
import { Sparkles, Link as LinkIcon, ExternalLink, Atom } from 'lucide-react'
import { cn } from '@/app/(frontend)/lib/utils'

type SynthesizedAtomDisplayProps = {
  atom: any
  className?: string
  onFocusParentAtom?: (atomId: string, pineconeId: string, collection: string) => void
}

export function SynthesizedAtomDisplay({
  atom,
  className = '',
  onFocusParentAtom,
}: SynthesizedAtomDisplayProps) {
  if (!atom) return null

  const handleParentAtomClick = (parent: any) => {
    if (onFocusParentAtom && parent.id && parent.pineconeId) {
      onFocusParentAtom(parent.id, parent.pineconeId, 'atoms')
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-white dark:bg-gray-900 border-2 border-green-500 dark:border-green-700 rounded-lg shadow-sm',
        className,
      )}
    >
      <div className="px-6 py-4 border-b border-green-500 dark:border-green-700 flex justify-between items-center bg-green-50 dark:bg-green-950">
        <div>
          <div className="flex items-center gap-2">
            <Atom className="h-5 w-5 text-green-600 dark:text-green-400 mr-1" />
            <Badge className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700">
              <Sparkles className="h-3 w-3 mr-1" />
              SYNTHESIS
            </Badge>
            {atom.title && (
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white leading-tight">
                {atom.title}
              </h2>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
            Synthesized Concept
          </h3>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800 text-gray-800 dark:text-gray-200">
            {atom.mainContent}
          </div>
        </div>

        {atom.supportingInfo && atom.supportingInfo.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider flex items-center">
              <LinkIcon className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
              Key Insights
            </h3>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                {atom.supportingInfo.map((info: any, index: number) => (
                  <li key={index}>{info.text}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {atom.theoryFiction && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Theory Fiction
            </h3>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border-l-4 border-green-400 dark:border-green-600 text-gray-800 dark:text-gray-200 italic">
              {atom.theoryFiction}
            </div>
          </div>
        )}

        {atom.parentAtoms && atom.parentAtoms.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider flex items-center">
              <LinkIcon className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
              Parent Atoms
            </h3>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800">
              <div className="space-y-3">
                {atom.parentAtoms.map((parent: any) => (
                  <div
                    key={parent.id}
                    className={cn(
                      'p-3 rounded-md border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-800',
                      onFocusParentAtom && parent.pineconeId
                        ? 'cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors'
                        : '',
                    )}
                    onClick={() =>
                      onFocusParentAtom && parent.pineconeId && handleParentAtomClick(parent)
                    }
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-blue-700 dark:text-blue-400">
                          {parent.title || `Atom ${parent.id}`}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {parent.mainContent}
                        </p>
                      </div>
                      {onFocusParentAtom && parent.pineconeId && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Focus on this atom"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleParentAtomClick(parent)
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {parent.source && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">
                          {parent.source.title || `Source ${parent.source.id}`}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
