'use client'

import { useState, useEffect } from 'react'
import { useFormState } from 'react-dom'
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
  const [frontmatterData, setFrontmatterData] = useState(null)
  const [parseError, setParseError] = useState(null)

  const [state, formAction] = useFormState(processSourceAction, initialState)

  const handleContentChange = (newContent: string) => {
    setContent(newContent)

    const result = parseFrontmatter(newContent)
    // @ts-ignore
    setFrontmatterData(result.data)
    // @ts-ignore
    setParseError(result.error)

    if (state.processed) {
      state.processed = false
      state.result = null
      state.error = null
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
