'use client'

import React from 'react'

interface SourceConfirmationProps {
  sourceData: any
}

export const SourceConfirmation = ({ sourceData }: SourceConfirmationProps) => {
  if (!sourceData) return null

  // Display only the first few fields for preview
  const previewFields = ['title', 'url', 'author', 'publishedDate', 'oneSentenceSummary']

  return (
    <div className="mt-6 p-6 border border-green-500 rounded-lg bg-slate-900 text-slate-100">
      <h3 className="text-green-400 mt-0">Source Successfully Created!</h3>
      <p className="mb-4">
        Document ID: <strong>{sourceData.id}</strong>
      </p>

      <div className="bg-slate-800 p-4 rounded border border-slate-700">
        <h4 className="mt-0">Document Preview:</h4>
        {previewFields.map((field) =>
          sourceData[field] ? (
            <div key={field} className="mb-3">
              <div className="font-bold mb-1 text-blue-200">
                {field.charAt(0).toUpperCase() + field.slice(1)}:
              </div>
              <div
                className={`whitespace-pre-wrap overflow-hidden text-ellipsis ${
                  field === 'oneSentenceSummary' ? 'max-h-[150px]' : 'max-h-[75px]'
                }`}
              >
                {sourceData[field]}
              </div>
            </div>
          ) : null,
        )}
      </div>

      <div className="mt-4">
        <a
          href={`/admin/collections/sources/${sourceData.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-green-500 text-slate-100 no-underline rounded font-bold hover:bg-green-600 transition-colors"
        >
          View Full Document in Admin
        </a>
      </div>
    </div>
  )
}
