'use client'

import React, { useEffect, useState } from 'react'

interface LoadingIndicatorProps {
  status: string
}

export const LoadingIndicator = ({ status }: LoadingIndicatorProps) => {
  // Add client-side timer to show dynamic progress
  const [dots, setDots] = useState(0)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    // Set up interval for animated dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4)
    }, 500)

    // Set up interval for elapsed time
    const elapsedInterval = setInterval(() => {
      setElapsed((prev) => prev + 1)
    }, 1000)

    // Clean up intervals
    return () => {
      clearInterval(dotsInterval)
      clearInterval(elapsedInterval)
    }
  }, [])

  // Generate animated dots
  const animatedDots = '.'.repeat(dots)

  // Format elapsed time
  const formatElapsed = () => {
    if (elapsed < 60) return `${elapsed}s`
    const minutes = Math.floor(elapsed / 60)
    const seconds = elapsed % 60
    return `${minutes}m ${seconds}s`
  }

  // Map status to user-friendly message
  const getMessage = () => {
    switch (status) {
      case 'processing_llm':
        return 'Processing content with AI'
      case 'creating_source':
        return 'Creating source document'
      case 'creating_atoms':
        return 'Generating atomic concepts'
      case 'processing':
        return 'Processing your request'
      default:
        return 'Processing'
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1.5rem',
        marginTop: '1rem',
        marginBottom: '1rem',
        backgroundColor: '#1a2233',
        borderRadius: '8px',
        border: '1px solid #3d4e6e',
        color: '#e1e8f5',
      }}
    >
      <div
        style={{
          marginBottom: '1rem',
          fontSize: '1.1rem',
          fontWeight: 'bold',
        }}
      >
        {getMessage()}
        {animatedDots}
      </div>

      <div style={{ fontSize: '0.9rem', color: '#a9c5f5', marginBottom: '1rem' }}>
        Time elapsed: {formatElapsed()}
      </div>

      <div
        style={{
          width: '100%',
          height: '6px',
          backgroundColor: '#2a3a5a',
          borderRadius: '3px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '30%',
            backgroundColor: '#4CAF50',
            borderRadius: '3px',
            animation: 'loading-animation 2s infinite ease-in-out',
          }}
        />
      </div>

      <style jsx>{`
        @keyframes loading-animation {
          0% {
            left: -30%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  )
}
