'use client'

import { useState, useActionState, useEffect } from 'react'
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
  message: null,
  frontmatterData: null,
  sourceId: null, // Track the source ID for polling
  originalContent: null, // Store the original content
}

// Storage key for persisting state
const STORAGE_KEY = 'sourceUploadState'

export function useSourceForm() {
  const [content, setContent] = useState('')
  const [frontmatterData, setFrontmatterData] = useState<any>(null)
  const [parseError, setParseError] = useState<string | null>(null)

  // Check if we already have a processing session in localStorage
  const [isInitialized, setIsInitialized] = useState(false)

  const [state, formAction] = useActionState(processSourceAction, initialState)

  // Init from localStorage if available (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        const savedState = localStorage.getItem(STORAGE_KEY)
        if (savedState) {
          const parsed = JSON.parse(savedState)
          // Only restore if we were previously processing
          if (parsed.isProcessing && parsed.sourceId) {
            console.log('Restoring processing state from storage:', parsed.sourceId)
            Object.assign(state, parsed)

            // If there was content, restore it
            if (parsed.originalContent) {
              setContent(parsed.originalContent)
              const { data } = parseFrontmatter(parsed.originalContent)
              setFrontmatterData(data)
            }
          }
        }
      } catch (e) {
        console.error('Error parsing saved state:', e)
      }
      setIsInitialized(true)
    }
  }, [])

  // Save state to localStorage when it changes and we're processing
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized && state.isProcessing && state.sourceId) {
      const stateToSave = {
        isProcessing: state.isProcessing,
        sourceId: state.sourceId,
        processingStage: state.processingStage,
        originalContent: content,
      }

      console.log('Saving processing state to storage:', state.sourceId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave))
    }
  }, [state.isProcessing, state.sourceId, state.processingStage, content, isInitialized])

  const handleContentChange = (newContent: string) => {
    setContent(newContent)

    const { data, error } = parseFrontmatter(newContent)
    setFrontmatterData(data)
    setParseError(error)

    // Reset processed state when content changes
    if (state.processed) {
      Object.assign(state, initialState)

      // Also clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }

  const handleFormAction = (formData: FormData) => {
    if (!frontmatterData) return

    // Set processing state before starting
    Object.assign(state, {
      ...initialState,
      isProcessing: true,
      processingStage: 'source',
    })

    // The action will internally set processed and result fields
    formAction(formData)
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

  // Determine if a source was created successfully
  const isSourceCreated = () => {
    return !!state.sourceCreated
  }

  // Clear processing state
  const clearProcessing = () => {
    if (typeof window !== 'undefined') {
      console.log('Clearing processing state')
      localStorage.removeItem(STORAGE_KEY)
    }

    // Reset processing-related state but keep results
    Object.assign(state, {
      ...state,
      isProcessing: false,
      processingStage: null,
    })
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
    clearProcessing,
  }
}
