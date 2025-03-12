'use client'

import { useState, useActionState } from 'react'
import { parseFrontmatter } from '../frontmatterParser'
import { processSourceAction } from '../actions'

// Initial state for form submission
const initialState = {
  result: null,
  error: null,
  processed: false,
}

export function useSourceForm() {
  const [content, setContent] = useState('')
  const [frontmatterData, setFrontmatterData] = useState<any>(null)
  const [parseError, setParseError] = useState<string | null>(null)

  const [state, formAction] = useActionState(processSourceAction, initialState)

  const handleContentChange = (newContent: string) => {
    setContent(newContent)

    const { data, error } = parseFrontmatter(newContent)
    setFrontmatterData(data)
    setParseError(error)

    // Reset processed state when content changes
    if (state.processed) {
      Object.assign(state, initialState)
    }
  }

  const handleFormAction = (formData: FormData) => {
    if (!frontmatterData) return
    return formAction(formData)
  }

  return {
    content,
    frontmatterData,
    parseError,
    state,
    handleContentChange,
    handleFormAction,
  }
}
