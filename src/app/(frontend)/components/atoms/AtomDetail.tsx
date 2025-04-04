'use client'

import React from 'react'
import { formatDate } from '@/app/(frontend)/lib/utils'
import { Atom } from '@/payload-types'

interface AtomDetailProps {
  atom: Atom
}

export function AtomDetail({ atom }: AtomDetailProps) {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold leading-tight">{atom.title || 'Untitled Atom'}</h1>

        <div className="mb-8 rounded-md bg-muted p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase">Main Content</h3>
          <p className="whitespace-pre-wrap text-base leading-relaxed" style={{ maxWidth: '65ch' }}>
            {atom.mainContent}
          </p>
        </div>

        {atom.supportingQuote && (
          <div className="mb-8">
            <h3 className="mb-3 text-sm font-semibold uppercase">Supporting Quote</h3>
            <blockquote
              className="border-l-4 border-gray-300 pl-5 py-2 italic text-base leading-relaxed"
              style={{ maxWidth: '65ch' }}
            >
              {atom.supportingQuote}
            </blockquote>
          </div>
        )}

        {atom.supportingInfo && atom.supportingInfo.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-3 text-sm font-semibold uppercase">Supporting Information</h3>
            <ul className="ml-6 list-disc space-y-3" style={{ maxWidth: '65ch' }}>
              {atom.supportingInfo.map((info, index) => (
                <li key={index} className="text-base leading-relaxed">
                  {info.text}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 border-t pt-5">
          <h3 className="text-sm font-semibold uppercase">Atom Information</h3>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div className="text-muted-foreground">Created</div>
            <div>{formatDate(atom.createdAt)}</div>
            <div className="text-muted-foreground">Updated</div>
            <div>{formatDate(atom.updatedAt)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
