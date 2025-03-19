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
        className="w-full mb-4 font-mono"
        disabled={isProcessing}
      />

      <button
        type="submit"
        disabled={!frontmatterData || isProcessing}
        className={`
          px-4 py-2 text-white font-bold rounded
          transition-colors duration-200
          ${
            frontmatterData && !isProcessing
              ? 'bg-slate-700 hover:bg-slate-800 cursor-pointer'
              : 'bg-slate-400 cursor-not-allowed'
          }
        `}
      >
        {isProcessing ? 'Processing...' : 'Submit'}
      </button>
    </form>
  )
}
