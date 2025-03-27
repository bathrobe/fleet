'use client'

import React, { useState } from 'react'
import { Atom } from '@/app/(frontend)/lib/atoms'
import { cn } from '@/app/(frontend)/lib/utils'
import { Button } from '@/app/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/card'
import { Badge } from '@/app/ui/badge'
import { saveSynthesizedAtom } from '../actions/saveSynthesizedAtom'
import { CheckCircle, Sparkles, Link as LinkIcon, ExternalLink } from 'lucide-react'

type SynthesizedAtomCardProps = {
  atom: any
  className?: string
  onFocusParentAtom?: (atomId: string, pineconeId: string, collection: string) => void
}

export function SynthesizedAtomCard({
  atom,
  className = '',
  onFocusParentAtom,
}: SynthesizedAtomCardProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await saveSynthesizedAtom(atom)
      setIsSaved(true)
    } catch (error) {
      console.error('Failed to save atom:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleParentAtomClick = (parent: any) => {
    if (onFocusParentAtom && parent.id && parent.pineconeId) {
      onFocusParentAtom(parent.id, parent.pineconeId, 'atoms')
    }
  }

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">SYNTHESIS</Badge>
          {atom.title && <CardTitle>{atom.title}</CardTitle>}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col h-full">
        <p className="text-gray-700 dark:text-gray-200 mb-4 flex-grow">{atom.mainContent}</p>

        {atom.supportingInfo && atom.supportingInfo.length > 0 && (
          <div className="mt-2">
            <h3 className="text-sm font-medium mb-1">Key Insights</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {atom.supportingInfo.map((info: any, index: number) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">
                  {info.text}
                </li>
              ))}
            </ul>
          </div>
        )}

        {atom.theoryFiction && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-md border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium mb-2">Theory Fiction</h3>
            <p className="text-gray-700 dark:text-gray-300 italic">{atom.theoryFiction}</p>
          </div>
        )}

        {atom.parentAtoms && atom.parentAtoms.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-md border border-blue-100 dark:border-blue-800">
            <h3 className="text-sm font-semibold mb-2 flex items-center">
              <LinkIcon className="h-4 w-4 mr-1.5 text-blue-500" />
              <span>Parent Atoms</span>
            </h3>
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
        )}

        {isSaved ? (
          <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 shadow-sm animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-800/30 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-300">Synthesis Saved!</h4>
                <p className="text-sm text-green-700 dark:text-green-400">
                  Your synthesized atom has been added to the collection and will appear in the atom
                  map.
                </p>
              </div>
            </div>
            <div className="mt-3 border-t border-green-200 dark:border-green-800 pt-3 flex justify-between items-center">
              <div className="flex items-center text-green-600 dark:text-green-400 gap-1 text-sm">
                <Sparkles className="h-4 w-4" />
                <span>New connections are being formed</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-green-200 text-green-700 hover:bg-green-100 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/30"
                onClick={() => setIsSaved(false)}
              >
                Create Another
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={handleSave}
            className="mt-4 cursor-pointer"
            variant="default"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Synthesis'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
