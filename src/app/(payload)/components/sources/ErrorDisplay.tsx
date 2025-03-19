'use client'

import React from 'react'

export const ErrorDisplay = ({ error }: { error: string }) => {
  if (!error) return null

  return (
    <div className="p-4 bg-red-950 border border-red-800 rounded-md mb-4 text-red-100 shadow-sm text-sm">
      <div className="font-bold mb-2 text-red-300">Error:</div>
      <div className="whitespace-pre-wrap">{error}</div>
    </div>
  )
}
