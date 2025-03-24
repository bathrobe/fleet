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

// Fields that need to be converted from text to arrays of {text: value}
const ARRAY_FIELDS = [
  'mainPoints',
  'bulletSummary',
  'peopleplacesthingsevents',
  'quotations',
  'details',
]

/**
 * Converts a string text field into an array of {text: string} objects
 * @param text Text to convert to array format
 */
const convertTextToArrayFormat = (text: string): { text: string }[] => {
  if (!text || typeof text !== 'string') return []

  // Split by newlines and filter out empty lines
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => ({ text: line }))
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

    // Add the sourceCategory
    newFormData.append('sourceCategory', selectedCategory)

    // Process frontmatter data
    if (frontmatterData) {
      // Convert string fields that should be arrays into proper format
      for (const field in frontmatterData) {
        if (ARRAY_FIELDS.includes(field) && frontmatterData[field]) {
          // For array fields, convert text to array of {text: string} objects
          const arrayData = convertTextToArrayFormat(frontmatterData[field])

          // Stringify the array data for transport in FormData
          newFormData.append(field, JSON.stringify(arrayData))
          console.log(`Converted field ${field} to array format:`, arrayData)
        } else {
          // Keep other fields as is
          newFormData.append(field, frontmatterData[field])
        }
      }
    }

    // Set processing state before starting
    Object.assign(state, {
      ...initialState,
      isProcessing: true,
      processingStage: 'source',
    })

    // Log what we're submitting
    console.log('Submitting form with categoryId:', selectedCategory)
    console.log('Form data fields:', Array.from(newFormData.keys()))

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
