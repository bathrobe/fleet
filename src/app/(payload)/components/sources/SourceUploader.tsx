'use client'

import { useEffect, useState } from 'react'
import { FrontmatterDisplay } from './FrontmatterDisplay'
import { ErrorDisplay } from './ErrorDisplay'
import { ContentForm } from './ContentForm'
import { LLMResponseDisplay } from './llm/LLMResponseDisplay'
import { SourcePageLayout } from './SourcePageLayout'
import { SourceConfirmation } from './SourceConfirmation'
import { useSourceForm } from './hooks/useSourceForm'
import { AtomsDisplay } from './atoms/AtomsDisplay'
import { LoadingIndicator } from './LoadingIndicator'
import { getPayload } from 'payload'

// Status polling interval in milliseconds
const POLLING_INTERVAL = 8000

// Sidebar wrapper component for consistent styling
const Sidebar = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      backgroundColor: '#1a2233',
      padding: '1.5rem',
      borderRadius: '8px',
      border: '1px solid #2a3a5a',
    }}
  >
    <h3
      style={{
        margin: '0 0 1.25rem 0',
        fontSize: '1.2rem',
        color: '#e1e8f5',
        borderBottom: '1px solid #2a3a5a',
        paddingBottom: '0.75rem',
      }}
    >
      Document Info
    </h3>
    {children}
  </div>
)

export default function SourceUploader() {
  const {
    content,
    frontmatterData,
    parseError,
    state,
    handleContentChange,
    handleFormAction,
    isSourceCreated,
    sourceData,
    clearProcessing,
  } = useSourceForm()

  // Local state to track polling
  const [pollCount, setPollCount] = useState(0)
  const [pollStatus, setPollStatus] = useState<{
    sourceId?: string
    hasSource: boolean
    hasAtoms: boolean
    complete: boolean
    lastUpdated: number
  }>({
    hasSource: false,
    hasAtoms: false,
    complete: false,
    lastUpdated: Date.now(),
  })

  // Track completion - when polling shows we're done
  useEffect(() => {
    if (pollStatus.complete && state.isProcessing) {
      // When poll shows complete, update the app state
      clearProcessing()

      // Force a hard refresh if sources were created to reload from server
      if (pollStatus.hasSource && pollStatus.hasAtoms) {
        // Wait a moment for state to be updated
        setTimeout(() => {
          window.location.href = '/admin/collections/sources'
        }, 1000)
      }
    }
  }, [pollStatus.complete, state.isProcessing])

  // Determine loading state and stage
  const isProcessing = state.isProcessing
  const processingStage = pollStatus.hasSource ? 'atoms' : 'source'

  // Set up polling while processing - NOT full page refresh
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    // Only poll if we have a process ID and are in processing state
    if (isProcessing) {
      const sourceId = state.sourceId
      const checkStatus = async () => {
        try {
          // Get current source ID from state
          const currentSourceId = state.sourceId

          // Skip if no process to check
          if (!currentSourceId) {
            return
          }

          const response = await fetch(`/api/source-status?sourceId=${currentSourceId}`)
          if (response.ok) {
            const data = await response.json()

            // Update polling status based on the response
            setPollStatus({
              sourceId: currentSourceId,
              hasSource: data.hasSource,
              hasAtoms: data.hasAtoms,
              complete: data.complete,
              lastUpdated: Date.now(),
            })

            // Increment poll count for UI updates
            setPollCount((prev) => prev + 1)
          }
        } catch (error) {
          console.error('Error polling for status:', error)
        }
      }

      // Start polling
      intervalId = setInterval(checkStatus, POLLING_INTERVAL)

      // Do an immediate check too
      checkStatus()
    }

    // Clean up interval on unmount
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isProcessing, state.sourceId])

  // For debugging
  console.log('State:', {
    processed: state.processed,
    sourceCreated: state.sourceCreated,
    hasResult: !!state.result,
    hasError: !!state.error,
    isSourceCreated,
    isProcessing,
    processingStage,
    pollCount,
    pollStatus,
  })

  // Sidebar content with frontmatter validator and atoms (if available)
  const sidebar = (
    <Sidebar>
      {frontmatterData && <FrontmatterDisplay data={frontmatterData} />}
      {parseError && <ErrorDisplay error={parseError} />}

      {/* Show atoms if they were created */}
      {state.atomsResult && state.atomsResult.success && (
        <AtomsDisplay atoms={state.atomsResult.atoms} />
      )}
    </Sidebar>
  )

  // Calculate how long we've been processing
  const processingTime =
    isProcessing && pollStatus.lastUpdated
      ? Math.floor((Date.now() - pollStatus.lastUpdated) / 1000)
      : 0

  return (
    <SourcePageLayout title="Source Uploader" sidebar={sidebar}>
      <p>Paste markdown content with frontmatter below:</p>

      <ContentForm
        content={content}
        onContentChange={handleContentChange}
        frontmatterData={frontmatterData}
        formAction={handleFormAction}
        isProcessing={isProcessing}
      />

      {/* Show loading indicator when processing */}
      {isProcessing && (
        <>
          <LoadingIndicator isProcessing={isProcessing} stage={processingStage} />
          <div
            style={{
              textAlign: 'center',
              fontSize: '0.8rem',
              color: '#A0AEC0',
              marginTop: '0.5rem',
            }}
          >
            {pollStatus.hasSource ? 'Creating atoms from source...' : 'Processing with LLM...'}
            <div style={{ marginTop: '0.25rem' }}>
              {pollCount > 0 && `Status check: ${pollCount}`}
            </div>
          </div>
        </>
      )}

      {/* Show processing message */}
      {state.message && (
        <div
          style={{
            padding: '1rem',
            margin: '1rem 0',
            backgroundColor: '#2D3748',
            borderRadius: '8px',
            color: '#E2E8F0',
          }}
        >
          {state.message}
        </div>
      )}

      {/* Display any form submission errors */}
      {state.error && <ErrorDisplay error={state.error} />}

      {/* Show source confirmation when source is successfully created */}
      {state.sourceCreated && sourceData && <SourceConfirmation sourceData={sourceData} />}

      {/* Only show LLM response if there's no source created but we have content from LLM */}
      {state.result && !state.sourceCreated && typeof state.result.content === 'string' && (
        <LLMResponseDisplay result={state.result.content} />
      )}
    </SourcePageLayout>
  )
}
