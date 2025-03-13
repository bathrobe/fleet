'use client'

import React from 'react'

export const ErrorDisplay = ({ error }: { error: string }) => {
  if (!error) return null

  return (
    <div
      style={{
        padding: '12px 16px',
        background: '#2d1a1a',
        border: '1px solid #5a3a3a',
        borderRadius: '6px',
        marginBottom: '1rem',
        color: '#f5c5c5',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        fontSize: '0.9rem',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#ff8b8b' }}>Error:</div>
      <div style={{ whiteSpace: 'pre-wrap' }}>{error}</div>
    </div>
  )
}
