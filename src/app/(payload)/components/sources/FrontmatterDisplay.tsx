'use client'

import React from 'react'

export const FrontmatterDisplay = ({ data }: { data: any }) => {
  if (!data) return null

  return (
    <div
      style={{
        padding: '16px',
        background: '#1a2b1a',
        border: '1px solid #3a5a3a',
        borderRadius: '6px',
        marginBottom: '1rem',
        color: '#c5e1c5',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h3 style={{ color: '#8bbb8b', marginTop: 0, fontSize: '1.1rem' }}>Frontmatter Validator</h3>
      <div
        style={{
          fontSize: '0.9rem',
          marginBottom: '0.5rem',
          padding: '4px 0',
          borderBottom: '1px solid #3a5a3a',
        }}
      >
        <span
          style={{
            backgroundColor: Object.keys(data).includes('title') ? '#2d4d2d' : '#4d2d2d',
            padding: '2px 6px',
            borderRadius: '3px',
            marginRight: '6px',
            color: Object.keys(data).includes('title') ? '#8bffa1' : '#ff8b8b',
          }}
        >
          title
        </span>
        <span
          style={{
            backgroundColor: Object.keys(data).includes('url') ? '#2d4d2d' : '#4d2d2d',
            padding: '2px 6px',
            borderRadius: '3px',
            color: Object.keys(data).includes('url') ? '#8bffa1' : '#ff8b8b',
          }}
        >
          url
        </span>
      </div>
      <pre
        style={{
          color: '#d9f0d9',
          fontSize: '0.85rem',
          maxHeight: '400px',
          overflowY: 'auto',
          padding: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '4px',
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
