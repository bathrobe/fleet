'use client'

import { useState, useEffect } from 'react'
import { useFormState } from 'react-dom'
import { parseFrontmatter } from '../frontmatterParser'
import { processSourceAction } from '../server/sourceActions'

// Initial state for form submission
const initialState = {
  result: null,
  error: null,
  processed: false,
}

export function useSourceForm() {
  const [content, setContent] = useState('')
  const [frontmatterData, setFrontmatterData] = useState(null)
  const [parseError, setParseError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Use React's form state hook for the server action
  const [state, formAction] = useFormState(processSourceAction, initialState)

  // Handle content changes and parse frontmatter
  const handleContentChange = (newContent: string) => {
    setContent(newContent)

    // Parse frontmatter when content changes
    const result = parseFrontmatter(newContent)
    // @ts-ignore
    setFrontmatterData(result.data)
    // @ts-ignore
    setParseError(result.error)

    // Reset processed state when content changes
    if (state.processed) {
      state.processed = false
      state.result = null
      state.error = null
    }
  }

  // Check if processing has completed
  useEffect(() => {
    if (state.processed) {
      setIsSubmitting(false)
    }
  }, [state.processed])

  const handleFormAction = (formData: FormData) => {
    if (!frontmatterData) return
    setIsSubmitting(true)
    return formAction(formData)
  }

  return {
    content,
    frontmatterData,
    parseError,
    state,
    isSubmitting,
    handleContentChange,
    handleFormAction,
  }
}
