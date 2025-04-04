'use client'

import React from 'react'
import { formatDate } from '@/app/(frontend)/lib/utils'
import { SynthesizedAtom } from '@/payload-types'
import { Badge } from '@/app/ui/badge'
import { Lightbulb } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/app/(frontend)/ui/tooltip'

interface SynthesizedAtomDetailProps {
  atom: SynthesizedAtom
}

// Extend SynthesizedAtom type for runtime properties
interface ExtendedSynthesizedAtom extends SynthesizedAtom {
  posting?: {
    isPosted?: boolean
    twitterUrl?: string
    bskyUrl?: string
  }
}

export function SynthesizedAtomDetail({ atom }: SynthesizedAtomDetailProps) {
  // Use type assertion to handle runtime properties
  const extendedAtom = atom as ExtendedSynthesizedAtom

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="rounded-lg border border-green-200 bg-card p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold leading-tight">
          {extendedAtom.title || 'Untitled Synthesized Atom'}
        </h1>

        {/* Display synthesis method if available */}
        {extendedAtom.synthesisMethod && (
          <div className="mb-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="border-purple-300 dark:border-purple-700 flex items-center gap-1"
                >
                  <Lightbulb className="h-3 w-3 text-purple-500 dark:text-purple-400" />
                  <span className="text-xs text-purple-600 dark:text-purple-400">
                    {typeof extendedAtom.synthesisMethod === 'object'
                      ? extendedAtom.synthesisMethod.title
                      : 'Synthesized'}
                  </span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-purple-50 dark:bg-purple-900 border border-purple-200 dark:border-purple-700 text-purple-800 dark:text-purple-200 py-2 px-3 rounded-md shadow-md">
                {typeof extendedAtom.synthesisMethod === 'object' &&
                extendedAtom.synthesisMethod.description
                  ? extendedAtom.synthesisMethod.description
                  : 'A method for synthesizing atoms'}
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        <div className="mb-8 rounded-md bg-muted p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase">Synthesized Content</h3>
          <p className="whitespace-pre-wrap text-base leading-relaxed" style={{ maxWidth: '65ch' }}>
            {extendedAtom.mainContent}
          </p>
        </div>

        {extendedAtom.theoryFiction && (
          <div className="mb-8">
            <h3 className="mb-3 text-sm font-semibold uppercase">Theory Fiction</h3>
            <blockquote
              className="border-l-4 border-green-300 pl-5 py-2 italic bg-gray-50 dark:bg-gray-800 p-4 rounded text-base leading-relaxed"
              style={{ maxWidth: '65ch' }}
            >
              {extendedAtom.theoryFiction}
            </blockquote>
          </div>
        )}

        {extendedAtom.supportingInfo && extendedAtom.supportingInfo.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-3 text-sm font-semibold uppercase">Supporting Information</h3>
            <ul className="ml-6 list-disc space-y-3" style={{ maxWidth: '65ch' }}>
              {extendedAtom.supportingInfo.map((info, index) => (
                <li key={index} className="text-base leading-relaxed">
                  {info.text}
                </li>
              ))}
            </ul>
          </div>
        )}

        {extendedAtom.posting && (
          <div className="mb-8">
            <h3 className="mb-3 text-sm font-semibold uppercase">Posting Status</h3>
            <div className="rounded-md bg-muted p-4">
              <div className="flex items-center">
                <div
                  className={`h-2 w-2 rounded-full mr-2 ${extendedAtom.posting.isPosted ? 'bg-green-500' : 'bg-gray-300'}`}
                ></div>
                <p>{extendedAtom.posting.isPosted ? 'Posted' : 'Not Posted'}</p>
              </div>

              {extendedAtom.posting.twitterUrl && (
                <a
                  href={extendedAtom.posting.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center text-sm text-blue-600 hover:underline"
                >
                  <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
                  </svg>
                  View on Twitter
                </a>
              )}

              {extendedAtom.posting.bskyUrl && (
                <a
                  href={extendedAtom.posting.bskyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center text-sm text-blue-600 hover:underline"
                >
                  <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1l9 4.5v5.5c0 5.5-4 10-9 12.5-5-2.5-9-7-9-12.5v-5.5l9-4.5z" />
                  </svg>
                  View on Bluesky
                </a>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 border-t pt-5">
          <h3 className="text-sm font-semibold uppercase">Atom Information</h3>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div className="text-muted-foreground">Created</div>
            <div>{formatDate(extendedAtom.createdAt)}</div>
            <div className="text-muted-foreground">Updated</div>
            <div>{formatDate(extendedAtom.updatedAt)}</div>
            <div className="text-muted-foreground">Type</div>
            <div>Synthesized Atom</div>

            {/* Add synthesis method information */}
            {extendedAtom.synthesisMethod && (
              <>
                <div className="text-muted-foreground">Synthesis Method</div>
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-purple-600 dark:text-purple-400 cursor-help">
                        {typeof extendedAtom.synthesisMethod === 'object'
                          ? extendedAtom.synthesisMethod.title
                          : 'Unknown Method'}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-purple-50 dark:bg-purple-900 border border-purple-200 dark:border-purple-700 text-purple-800 dark:text-purple-200 py-2 px-3 rounded-md shadow-md">
                      {typeof extendedAtom.synthesisMethod === 'object' &&
                      extendedAtom.synthesisMethod.description
                        ? extendedAtom.synthesisMethod.description
                        : 'A method for synthesizing atoms'}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
