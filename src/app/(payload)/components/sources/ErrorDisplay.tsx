'use client'

import React from 'react'

export const ErrorDisplay = ({ error }: { error: any }) => {
  if (!error) return null

  return (
    <div
      style={{
        padding: '10px',
        background: '#3f0000',
        border: '1px solid #f55',
        borderRadius: '4px',
        marginBottom: '1rem',
        color: '#ff9999',
      }}
    >
      <p>{error}</p>
    </div>
  )
}
