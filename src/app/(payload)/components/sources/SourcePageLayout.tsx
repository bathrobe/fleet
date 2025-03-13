'use client'

import React from 'react'
import Link from 'next/link'

interface SourcePageLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  title: string
}

export function SourcePageLayout({ children, sidebar, title }: SourcePageLayoutProps) {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h1 style={{ margin: 0, color: '#e1e8f5' }}>{title}</h1>
        <Link
          href="/admin"
          style={{
            textDecoration: 'none',
            color: '#a9c5f5',
            fontWeight: 'bold',
            padding: '0.5rem 1rem',
            backgroundColor: '#2a3a5a',
            borderRadius: '0.25rem',
            transition: 'background-color 0.2s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#3a4a6a')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2a3a5a')}
        >
          Back to Admin
        </Link>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '2rem',
          flexDirection: sidebar ? 'row' : 'column',
        }}
      >
        {/* Main content area */}
        <div
          style={{
            flex: '1 1 auto',
            minWidth: 0, // Prevent flex item from overflowing
          }}
        >
          {children}
        </div>

        {/* Right sidebar, only rendered if provided */}
        {sidebar && (
          <div
            style={{
              width: '350px',
              flex: '0 0 350px',
            }}
          >
            {sidebar}
          </div>
        )}
      </div>
    </div>
  )
}
