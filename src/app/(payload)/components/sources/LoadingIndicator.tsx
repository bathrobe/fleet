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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        margin: '1rem 0',
        backgroundColor: '#1E293B',
        borderRadius: '8px',
        border: '1px solid #2D3748',
        color: '#E2E8F0',
        fontFamily: 'monospace',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ animation: 'spin 2s linear infinite' }}
        >
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
          <circle cx="12" cy="12" r="10" stroke="#4A5568" strokeWidth="2" />
          <path
            d="M12 2C6.48 2 2 6.48 2 12"
            stroke="#90CDF4"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <span style={{ fontSize: '1rem', fontWeight: 500 }}>
          Processing
          <span style={{ width: '1.5rem', display: 'inline-block' }}>{dots}</span>
        </span>
      </div>
    </div>
  )
}
