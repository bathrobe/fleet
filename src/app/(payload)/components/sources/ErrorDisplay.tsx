'use client'

import React from 'react'
import { AlertCircle } from 'lucide-react'

export const ErrorDisplay = ({ error }: { error: string }) => {
  if (!error) return null

  return (
    <div className="p-4 bg-destructive/10 text-destructive rounded-md mb-4 shadow-sm text-sm flex gap-2 items-start">
      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div>
        <div className="font-semibold mb-1">Error:</div>
        <div className="whitespace-pre-wrap">{error}</div>
      </div>
    </div>
  )
}
