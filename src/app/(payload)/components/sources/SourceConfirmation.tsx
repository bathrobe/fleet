'use client'

import React from 'react'

interface SourceConfirmationProps {
  sourceData: any
}

export const SourceConfirmation = ({ sourceData }: SourceConfirmationProps) => {
  if (!sourceData) return null

  // Display only the first few fields for preview
  const previewFields = ['title', 'url', 'author', 'publishedDate', 'oneSentenceSummary']

  return (
    <div
      style={{
        marginTop: '1.5rem',
        padding: '1.5rem',
        border: '1px solid #4CAF50',
        borderRadius: '0.5rem',
        backgroundColor: '#1a2233',
        color: '#e1e8f5',
      }}
    >
      <h3 style={{ color: '#7CFC00', marginTop: 0 }}>Source Successfully Created!</h3>
      <p style={{ marginBottom: '1rem' }}>
        Document ID: <strong>{sourceData.id}</strong>
      </p>

      <div
        style={{
          backgroundColor: '#2a3a5a',
          padding: '1rem',
          borderRadius: '0.25rem',
          border: '1px solid #3d4e6e',
        }}
      >
        <h4 style={{ marginTop: 0 }}>Document Preview:</h4>
        {previewFields.map((field) =>
          sourceData[field] ? (
            <div key={field} style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: '#a9c5f5' }}>
                {field.charAt(0).toUpperCase() + field.slice(1)}:
              </div>
              <div
                style={{
                  whiteSpace: 'pre-wrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxHeight: field === 'oneSentenceSummary' ? '150px' : '75px',
                }}
              >
                {sourceData[field]}
              </div>
            </div>
          ) : null,
        )}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <a
          href={`/admin/collections/sources/${sourceData.id}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            backgroundColor: '#4CAF50',
            color: '#e1e8f5',
            textDecoration: 'none',
            borderRadius: '0.25rem',
            fontWeight: 'bold',
          }}
        >
          View Full Document in Admin
        </a>
      </div>
    </div>
  )
}
