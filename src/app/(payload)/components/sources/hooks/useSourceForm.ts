'use client'

import { useState, useActionState } from 'react'
import { parseFrontmatter } from '../frontmatterParser'
import { processSourceAction } from '../actions'

// Processing stages for the loading indicator
type ProcessingStage = 'source' | 'atoms' | null

// Initial state for form submission
const initialState = {
  result: null,
  atomsResult: null,
  error: null,
  processed: false,
  sourceCreated: false,
  isProcessing: false,
  processingStage: null as ProcessingStage,
}

export function useSourceForm() {
  const [content, setContent] = useState('')
  const [frontmatterData, setFrontmatterData] = useState<any>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('')

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

  const handleCategoryChange = (categoryId: string) => {
    console.log('Category changed to:', categoryId)

    // Convert the category ID to a number if possible
    const numericId = parseInt(categoryId, 10)
    setSelectedCategory(categoryId) // Keep as string in state for form control handling

    // Reset processed state when category changes
    if (state.processed) {
      Object.assign(state, initialState)
    }
  }

  const handleFormAction = (formData: FormData) => {
    if (!frontmatterData) {
      console.error('Cannot submit without frontmatter data')
      return
    }

    if (!selectedCategory) {
      console.error('Cannot submit without a category')
      return
    }

    // Create a new FormData to ensure proper format
    const newFormData = new FormData()

    // Add the content
    newFormData.append('content', content)

    // Add the sourceCategory - convert to number for Payload
    // Some database systems expect numeric IDs for relationships
    newFormData.append('sourceCategory', selectedCategory)

    // Set processing state before starting
    Object.assign(state, {
      ...initialState,
      isProcessing: true,
      processingStage: 'source',
    })

    // Log what we're submitting
    console.log('Submitting form with categoryId (raw):', selectedCategory)
    console.log('Submitting form with categoryId (as number):', parseInt(selectedCategory, 10))

    // Submit the form data
    formAction(newFormData)
  }

  // Update processing stage based on state changes
  if (state.isProcessing && state.result && !state.sourceCreated) {
    // If we have source results but no atoms yet, update to atoms stage
    if (state.processingStage === 'source') {
      state.processingStage = 'atoms'
    }
  }

  // Turn off processing when complete
  if (state.isProcessing && state.processed) {
    state.isProcessing = false
    state.processingStage = null
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
    selectedCategory,
    handleContentChange,
    handleCategoryChange,
    handleFormAction,
    isSourceCreated: isSourceCreated(),
    sourceData: state.result,
  }
}
