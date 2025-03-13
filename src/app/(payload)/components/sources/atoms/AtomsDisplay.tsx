'use client'

import React from 'react'

interface AtomDisplayProps {
  atoms: any[]
}

export const AtomsDisplay = ({ atoms }: AtomDisplayProps) => {
  if (!atoms || atoms.length === 0) return null

  return (
    <div
      style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: '#1a2233',
        borderRadius: '6px',
        border: '1px solid #2a3a5a',
      }}
    >
      <h3
        style={{
          margin: '0 0 1rem 0',
          color: '#8bb8ff',
          fontSize: '1.1rem',
          borderBottom: '1px solid #2a3a5a',
          paddingBottom: '0.5rem',
        }}
      >
        {atoms.length} Atoms Generated
      </h3>

      <div
        style={{
          maxHeight: '500px',
          overflowY: 'auto',
          paddingRight: '0.5rem',
        }}
      >
        {atoms.map((atom, index) => (
          <div
            key={index}
            style={{
              marginBottom: '1rem',
              padding: '0.75rem',
              backgroundColor: '#2a3a5a',
              borderRadius: '4px',
              border: '1px solid #3d4e6e',
            }}
          >
            <div
              style={{
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                color: '#c5e1ff',
                fontSize: '0.95rem',
              }}
            >
              {atom.title}
            </div>
            <div
              style={{
                marginBottom: '0.5rem',
                fontSize: '0.85rem',
                color: '#e1e8f5',
              }}
            >
              {atom.mainContent}
            </div>
            <div
              style={{
                marginTop: '0.5rem',
                fontSize: '0.8rem',
                color: '#a9c5f5',
                fontStyle: 'italic',
                borderLeft: '2px solid #4d6a9a',
                paddingLeft: '0.5rem',
              }}
            >
              &ldquo;{atom.supportingQuote}&rdquo;
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
