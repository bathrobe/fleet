'use client'

import React from 'react'

export const ProgressIndicator = ({ isProcessing }: { isProcessing: boolean }) => {
  if (!isProcessing) return null

  return (
    <div
      style={{
        marginTop: '1rem',
        padding: '10px',
        background: '#f0f9ff',
        border: '1px solid #ccc',
        borderRadius: '4px',
        textAlign: 'center',
      }}
    >
      <p>Processing content with AI...</p>
      <div
        style={{
          width: '100%',
          height: '4px',
          background: '#e0e0e0',
          overflow: 'hidden',
          position: 'relative',
          borderRadius: '2px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: '30%',
            background: '#4A5568',
            animation: 'loading 1.5s infinite ease-in-out',
          }}
        ></div>
        <style jsx>{`
          @keyframes loading {
            0% {
              left: -30%;
            }
            100% {
              left: 100%;
            }
          }
        `}</style>
      </div>
    </div>
  )
}
