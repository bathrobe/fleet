'use client'

import React from 'react'
import { formatDate } from '@/app/(frontend)/lib/utils'
import { Source } from '@/payload-types'
import Link from 'next/link'
import { Folder } from 'lucide-react'
import { Badge } from '@/app/ui/badge'

interface SourceDetailProps {
  source: Source
}

export function SourceDetail({ source }: SourceDetailProps) {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="rounded-lg border border-purple-200 bg-card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <h1 className="text-2xl font-bold leading-tight">{source.title}</h1>

          {source.sourceCategory && (
            <Badge
              variant="outline"
              className="mt-2 sm:mt-0 border-purple-300 flex items-center gap-1 max-w-fit"
            >
              <Folder className="h-3 w-3 text-purple-500" />
              <span className="text-xs">
                {typeof source.sourceCategory === 'object' && source.sourceCategory.title
                  ? source.sourceCategory.title
                  : 'Uncategorized'}
              </span>
            </Badge>
          )}
        </div>

        {source.author && <p className="mb-4 text-muted-foreground">By {source.author}</p>}

        {source.url && (
          <div className="mb-6">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline hover:text-blue-800"
            >
              {source.url}
            </a>
          </div>
        )}

        {source.oneSentenceSummary && (
          <div className="mb-8 rounded-md bg-muted p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase">Summary</h3>
            <p
              className="whitespace-pre-wrap text-base leading-relaxed"
              style={{ maxWidth: '65ch' }}
            >
              {source.oneSentenceSummary}
            </p>
          </div>
        )}

        {/* Main Points */}
        {source.mainPoints && source.mainPoints.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-3 text-sm font-semibold uppercase">Main Points</h3>
            <ul className="ml-6 list-disc space-y-3" style={{ maxWidth: '65ch' }}>
              {source.mainPoints.map((point, index) => (
                <li key={index} className="text-base leading-relaxed">
                  {point.text}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bullet Summary */}
        {source.bulletSummary && source.bulletSummary.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-3 text-sm font-semibold uppercase">Bullet Summary</h3>
            <ul className="ml-6 list-disc space-y-3" style={{ maxWidth: '65ch' }}>
              {source.bulletSummary.map((bullet, index) => (
                <li key={index} className="text-base leading-relaxed">
                  {bullet.text}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quotations */}
        {source.quotations && source.quotations.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-3 text-sm font-semibold uppercase">Quotations</h3>
            <div className="space-y-4" style={{ maxWidth: '65ch' }}>
              {source.quotations.map((quote, index) => (
                <blockquote
                  key={index}
                  className="border-l-4 border-purple-300 pl-5 py-2 italic text-base leading-relaxed"
                >
                  {quote.text}
                </blockquote>
              ))}
            </div>
          </div>
        )}

        {/* People, Places, Things, Events */}
        {source.peopleplacesthingsevents && source.peopleplacesthingsevents.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-3 text-sm font-semibold uppercase">People, Places, Things, Events</h3>
            <div className="flex flex-wrap gap-2" style={{ maxWidth: '65ch' }}>
              {source.peopleplacesthingsevents.map((item, index) => (
                <span
                  key={index}
                  className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-sm"
                >
                  {item.text}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 border-t pt-5">
          <h3 className="text-sm font-semibold uppercase">Source Information</h3>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div className="text-muted-foreground">Created</div>
            <div>{formatDate(source.createdAt)}</div>
            <div className="text-muted-foreground">Updated</div>
            <div>{formatDate(source.updatedAt)}</div>
            <div className="text-muted-foreground">Type</div>
            <div>Source Document</div>
            {source.publishedDate && (
              <>
                <div className="text-muted-foreground">Published</div>
                <div>{formatDate(source.publishedDate)}</div>
              </>
            )}
            {source.sourceCategory && (
              <>
                <div className="text-muted-foreground">Category</div>
                <div>
                  {typeof source.sourceCategory === 'object' && source.sourceCategory.title
                    ? source.sourceCategory.title
                    : 'Uncategorized'}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
