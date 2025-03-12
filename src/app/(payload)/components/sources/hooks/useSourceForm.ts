'use client'

import { useState, useEffect } from 'react'
import { useFormState } from 'react-dom'
import { parseFrontmatter } from '../frontmatterParser'
import { processSourceAction } from '../actions'

// Simplified state type
interface FormState {
  result: string | null
  error: string | null
  processed: boolean
}

// Initial state for form submission
const initialState: FormState = {
  result: null,
  error: null,
  processed: false,
}

export function useSourceForm() {
  const [content, setContent] = useState('')
  const [frontmatterData, setFrontmatterData] = useState<Record<string, any> | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [state, formAction] = useFormState(processSourceAction, initialState)

  const handleContentChange = (newContent: string) => {
    setContent(newContent)

    const result = parseFrontmatter(newContent)
    setFrontmatterData(result.data)
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
