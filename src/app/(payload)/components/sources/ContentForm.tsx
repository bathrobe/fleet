'use client'

import React from 'react'
import { useTransition } from 'react'

export const ContentForm = ({
  content,
  onContentChange,
  frontmatterData,
  formAction,
  isProcessing = false,
  selectedCategory = '',
}: {
  content: string
  onContentChange: (value: string) => void
  frontmatterData: any
  formAction: (formData: FormData) => void
  isProcessing?: boolean
  selectedCategory?: string
}) => {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!frontmatterData || !selectedCategory || isProcessing) {
      return
    }

    const formData = new FormData(e.currentTarget)

    // Wrap the formAction call in startTransition
    startTransition(() => {
      formAction(formData)
    })
  }

  // Only use the onSubmit handler, remove the action prop
  return (
    <form onSubmit={handleSubmit}>
      <textarea
        name="content"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="---\ntitle: My Document\ndate: 2023-05-01\ntags: [markdown, frontmatter]\n---\n\n# Content goes here"
        rows={10}
        className="w-full mb-4 font-mono"
        disabled={isProcessing || isPending}
      />

      <button
        type="submit"
        disabled={!frontmatterData || isProcessing || !selectedCategory || isPending}
        className={`
          px-4 py-2 text-white font-bold rounded
          transition-colors duration-200
          ${
            frontmatterData && !isProcessing && selectedCategory && !isPending
              ? 'bg-slate-700 hover:bg-slate-800 cursor-pointer'
              : 'bg-slate-400 cursor-not-allowed'
          }
        `}
      >
        {isProcessing || isPending ? 'Processing...' : 'Submit'}
      </button>
    </form>
  )
}
