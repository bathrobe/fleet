'use client'

import React from 'react'

export const Spinner = ({ isVisible }: { isVisible: boolean }) => {
  if (!isVisible) return null

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        margin: '20px 0',
      }}
    >
      <div
        style={{
          width: '30px',
          height: '30px',
          border: '3px solid rgba(0, 0, 0, 0.1)',
          borderTopColor: '#4A5568',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
