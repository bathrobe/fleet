'use client'

import React from 'react'

export const FrontmatterDisplay = ({ data }: { data: any }) => {
  if (!data) return null

  return (
    <div
      style={{
        padding: '10px',
        background: '#1a2b1a',
        border: '1px solid #3a5a3a',
        borderRadius: '4px',
        marginBottom: '1rem',
        color: '#c5e1c5',
      }}
    >
      <h3 style={{ color: '#8bbb8b', marginTop: 0 }}>Detected Frontmatter:</h3>
      <pre style={{ color: '#d9f0d9' }}>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
