'use client'

import React from 'react'
import Link from 'next/link'

interface SourcePageLayoutProps {
  children: React.ReactNode
  title: string
}

export function SourcePageLayout({ children, title }: SourcePageLayoutProps) {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h1>{title}</h1>
        <Link
          href="/admin"
          style={{
            textDecoration: 'none',
            color: '#4A5568',
            fontWeight: 'bold',
          }}
        >
          Back to Admin
        </Link>
      </div>
      {children}
    </div>
  )
}
