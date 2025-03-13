'use client'

import React from 'react'

export const ContentForm = ({
  content,
  onContentChange,
  frontmatterData,
  formAction,
  isProcessing = false,
}: {
  content: string
  onContentChange: (value: string) => void
  frontmatterData: any
  formAction: (formData: FormData) => void
  isProcessing?: boolean
}) => {
  return (
    <form action={formAction as any}>
      <textarea
        name="content"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="---\ntitle: My Document\ndate: 2023-05-01\ntags: [markdown, frontmatter]\n---\n\n# Content goes here"
        rows={10}
        style={{ width: '100%', marginBottom: '1rem', fontFamily: 'monospace' }}
        disabled={isProcessing}
      />

      <button
        type="submit"
        disabled={!frontmatterData || isProcessing}
        style={{
          backgroundColor: frontmatterData && !isProcessing ? '#4A5568' : '#A0AEC0',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: frontmatterData && !isProcessing ? 'pointer' : 'not-allowed',
          fontWeight: 'bold',
          transition: 'background-color 0.2s ease',
        }}
        onMouseOver={(e) =>
          frontmatterData && !isProcessing && (e.currentTarget.style.backgroundColor = '#2D3748')
        }
        onMouseOut={(e) =>
          frontmatterData && !isProcessing && (e.currentTarget.style.backgroundColor = '#4A5568')
        }
      >
        {isProcessing ? 'Processing...' : 'Submit'}
      </button>
    </form>
  )
}
