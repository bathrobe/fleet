'use client'

import React from 'react'
import { formatDate } from '@/app/(frontend)/lib/utils'
import { Atom } from '@/payload-types'

interface AtomDetailProps {
  atom: Atom
}

export function AtomDetail({ atom }: AtomDetailProps) {
  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-bold">{atom.title || 'Untitled Atom'}</h1>

        <div className="mb-6 rounded-md bg-muted p-4">
          <h3 className="mb-2 text-sm font-semibold uppercase">Main Content</h3>
          <p className="whitespace-pre-wrap">{atom.mainContent}</p>
        </div>

        {atom.supportingQuote && (
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold uppercase">Supporting Quote</h3>
            <blockquote className="border-l-4 border-gray-300 pl-4 italic">
              {atom.supportingQuote}
            </blockquote>
          </div>
        )}

        {atom.supportingInfo && atom.supportingInfo.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold uppercase">Supporting Information</h3>
            <ul className="ml-6 list-disc space-y-2">
              {atom.supportingInfo.map((info, index) => (
                <li key={index} className="text-sm">
                  {info.text}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2 border-t pt-4">
          <h3 className="text-sm font-semibold uppercase">Atom Information</h3>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
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
