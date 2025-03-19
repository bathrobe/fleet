'use client'

import React from 'react'

export const FrontmatterDisplay = ({ data }: { data: any }) => {
  if (!data) return null

  return (
    <div className="p-4 bg-emerald-950 border border-emerald-800 rounded-md mb-4 text-emerald-100 shadow-sm">
      <h3 className="text-emerald-300 mt-0 text-lg">Frontmatter Validator</h3>
      <div className="text-sm mb-2 py-1 border-b border-emerald-800">
        <span
          className={`inline-block px-2 py-0.5 rounded mr-1.5 ${
            Object.keys(data).includes('title')
              ? 'bg-emerald-900 text-emerald-300'
              : 'bg-red-900 text-red-300'
          }`}
        >
          title
        </span>
        <span
          className={`inline-block px-2 py-0.5 rounded ${
            Object.keys(data).includes('url')
              ? 'bg-emerald-900 text-emerald-300'
              : 'bg-red-900 text-red-300'
          }`}
        >
          url
        </span>
      </div>
      <pre className="text-emerald-50 text-sm max-h-[400px] overflow-y-auto p-2 bg-black/20 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
