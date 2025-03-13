'use client'

import { useState, useActionState } from 'react'
import { parseFrontmatter } from '../frontmatterParser'
import { processSourceAction } from '../actions'

// Initial state for form submission
const initialState = {
  result: null,
  atomsResult: null,
  error: null,
  processed: false,
  sourceCreated: false,
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

    // The action will internally set processed and result fields
    formAction(formData)
  }

  // Determine if a source was created successfully based on the sourceCreated flag directly
  // rather than trying to infer from other properties
  const isSourceCreated = () => {
    return !!state.sourceCreated
  }

  return {
    content,
    frontmatterData,
    parseError,
    state,
    handleContentChange,
    handleFormAction,
    isSourceCreated: isSourceCreated(),
    sourceData: state.result,
  }
}
