'use client'

import React from 'react'
import { Check } from 'lucide-react'

type FrontmatterDisplayProps = {
  data: Record<string, any>
}

export const FrontmatterDisplay = ({ data }: FrontmatterDisplayProps) => {
  // Format the frontmatter data for display (pretty-print keys and values)
  const formatData = () => {
    return Object.entries(data).map(([key, value]) => {
      // Format the key for display (capitalize, replace underscores with spaces)
      const formattedKey = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace(/^\w/, (c) => c.toUpperCase())

      // Format the value (stringify objects/arrays, limit length for display)
      let formattedValue = typeof value === 'string' ? value : JSON.stringify(value)

      // Truncate long values
      if (formattedValue.length > 100) {
        formattedValue = formattedValue.substring(0, 100) + '...'
      }

      return { key: formattedKey, value: formattedValue }
    })
  }

  return (
    <div className="my-4">
      <div className="flex items-center gap-2 text-sm text-primary mb-3">
        <Check className="h-4 w-4" />
        <span className="font-medium">Frontmatter Validated</span>
      </div>

      <div className="space-y-2 text-sm">
        {formatData().map(({ key, value }) => (
          <div key={key} className="flex flex-col">
            <span className="text-xs font-medium text-muted-foreground">{key}:</span>
            <span className="truncate">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
