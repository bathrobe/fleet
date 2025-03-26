'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/(frontend)/ui/card'
import { Badge } from '@/app/(frontend)/ui/badge'
import { Sparkles } from 'lucide-react'

type SynthesizedAtomDisplayProps = {
  atom: any
  className?: string
}

export function SynthesizedAtomDisplay({ atom, className = '' }: SynthesizedAtomDisplayProps) {
  if (!atom) return null

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500 hover:bg-emerald-600">
            <Sparkles className="h-3 w-3 mr-1" />
            SYNTHESIS
          </Badge>
          {atom.title && <CardTitle>{atom.title}</CardTitle>}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-gray-200 mb-4">{atom.mainContent}</p>

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
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-1">Parent Atoms</h3>
            <div className="flex flex-wrap gap-2">
              {atom.parentAtoms.map((parent: any) => (
                <Badge variant="outline" key={parent.id}>
                  {parent.title || `Atom ${parent.id}`}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
