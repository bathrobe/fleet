'use client'

import React from 'react'
import { formatDate } from '@/app/(frontend)/lib/utils'
import { Source } from '@/payload-types'
import Link from 'next/link'

interface SourceDetailProps {
  source: Source
}

export function SourceDetail({ source }: SourceDetailProps) {
  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="rounded-lg border border-purple-200 bg-card p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold">{source.title}</h1>

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
          <div className="mb-6 rounded-md bg-muted p-4">
            <h3 className="mb-2 text-sm font-semibold uppercase">Summary</h3>
            <p className="whitespace-pre-wrap">{source.oneSentenceSummary}</p>
          </div>
        )}

        {/* Main Points */}
        {source.mainPoints && source.mainPoints.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold uppercase">Main Points</h3>
            <ul className="ml-6 list-disc space-y-2">
              {source.mainPoints.map((point, index) => (
                <li key={index} className="text-sm">
                  {point.text}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bullet Summary */}
        {source.bulletSummary && source.bulletSummary.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold uppercase">Bullet Summary</h3>
            <ul className="ml-6 list-disc space-y-2">
              {source.bulletSummary.map((bullet, index) => (
                <li key={index} className="text-sm">
                  {bullet.text}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quotations */}
        {source.quotations && source.quotations.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold uppercase">Quotations</h3>
            <div className="space-y-4">
              {source.quotations.map((quote, index) => (
                <blockquote key={index} className="border-l-4 border-purple-300 pl-4 italic">
                  {quote.text}
                </blockquote>
              ))}
            </div>
          </div>
        )}

        {/* People, Places, Things, Events */}
        {source.peopleplacesthingsevents && source.peopleplacesthingsevents.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold uppercase">People, Places, Things, Events</h3>
            <div className="flex flex-wrap gap-2">
              {source.peopleplacesthingsevents.map((item, index) => (
                <span
                  key={index}
                  className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs"
                >
                  {item.text}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2 border-t pt-4">
          <h3 className="text-sm font-semibold uppercase">Source Information</h3>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
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
          </div>
        </div>
      </div>
    </div>
  )
}
