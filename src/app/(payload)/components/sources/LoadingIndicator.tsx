'use client'

import React, { useEffect, useState } from 'react'

interface LoadingIndicatorProps {
  isProcessing: boolean
  stage: 'source' | 'atoms' | null // keeping the type but not using stage for display
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isProcessing }) => {
  const [dots, setDots] = useState('')

  // Animation for the blinking dots
  useEffect(() => {
    if (!isProcessing) return

    // Update dots every 500ms
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return ''
        return prev + '.'
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isProcessing])

  if (!isProcessing) return null

  return (
    <div className="flex flex-col items-center justify-center p-4 my-4 bg-slate-800 rounded-lg border border-slate-700 text-slate-100 font-mono">
      <div className="flex items-center gap-2">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-spin"
        >
          <circle cx="12" cy="12" r="10" stroke="#4A5568" strokeWidth="2" />
          <path
            d="M12 2C6.48 2 2 6.48 2 12"
            stroke="#90CDF4"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-base font-medium">
          Processing
          <span className="inline-block w-6">{dots}</span>
        </span>
      </div>
    </div>
  )
}
