'use client'

import React, { useEffect, useState } from 'react'

type ProcessingStage = 'source' | 'atoms' | null

interface LoadingIndicatorProps {
  isProcessing: boolean
  stage: ProcessingStage
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isProcessing, stage }) => {
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

  let message = 'Processing'

  if (stage === 'source') {
    message = 'Analyzing source with Claude'
  } else if (stage === 'atoms') {
    message = 'Generating atoms from source'
  }

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
          {message}
          <span style={{ width: '1.5rem', display: 'inline-block' }}>{dots}</span>
        </span>
      </div>

      {/* Progress stages */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '1rem',
          width: '100%',
          maxWidth: '300px',
        }}
      >
        <div
          style={{
            flex: 1,
            height: '4px',
            backgroundColor: stage === 'source' ? '#90CDF4' : '#4A5568',
            borderRadius: '2px',
          }}
        />
        <div
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: stage === 'atoms' ? '#90CDF4' : '#4A5568',
            margin: '0 0.5rem',
            transition: 'background-color 0.3s ease',
          }}
        />
        <div
          style={{
            flex: 1,
            height: '4px',
            backgroundColor: stage === 'atoms' ? '#90CDF4' : '#4A5568',
            borderRadius: '2px',
          }}
        />
      </div>

      {/* Stage labels */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '300px',
          fontSize: '0.75rem',
          marginTop: '0.25rem',
          color: '#A0AEC0',
        }}
      >
        <span style={{ color: stage === 'source' ? '#90CDF4' : '#A0AEC0' }}>Source Analysis</span>
        <span style={{ color: stage === 'atoms' ? '#90CDF4' : '#A0AEC0' }}>Atoms Generation</span>
      </div>
    </div>
  )
}
