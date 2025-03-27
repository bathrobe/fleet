'use client'

import React from 'react'
import { useTransition } from 'react'
import { Button } from '@/app/ui/button'
import { Textarea } from '@/app/ui/textarea'
import { SendIcon } from 'lucide-react'

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

  const isDisabled = !frontmatterData || isProcessing || !selectedCategory || isPending

  // Only use the onSubmit handler, remove the action prop
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        name="content"
        value={content}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onContentChange(e.target.value)}
        placeholder="---\ntitle: My Document\ndate: 2023-05-01\ntags: [markdown, frontmatter]\n---\n\n# Content goes here"
        rows={12}
        className="font-mono text-sm resize-y"
        disabled={isProcessing || isPending}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={isDisabled} className="gap-2">
          <SendIcon className="h-4 w-4" />
          {isProcessing || isPending ? 'Processing...' : 'Submit'}
        </Button>
      </div>
    </form>
  )
}
