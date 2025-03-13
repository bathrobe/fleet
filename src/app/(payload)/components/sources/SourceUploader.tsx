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
import { checkProcessingStatus } from './actions'

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
  } = useSourceForm()

  // Local state to track auto-refresh
  const [refreshCount, setRefreshCount] = useState(0)

  // Determine loading state and stage
  const isProcessing = state.isProcessing
  const processingStage = state.processingStage

  // Set up auto-refresh while processing
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    // If we're processing, start the refresh interval
    if (isProcessing) {
      intervalId = setInterval(() => {
        setRefreshCount((prev) => prev + 1)

        // Refresh the page to check for updates
        // This is a simple approach - in a production app you might
        // want to implement a more sophisticated polling mechanism
        window.location.reload()
      }, 10000) // Refresh every 10 seconds
    }

    // Clean up on unmount
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isProcessing])

  // For debugging
  console.log('State:', {
    processed: state.processed,
    sourceCreated: state.sourceCreated,
    hasResult: !!state.result,
    hasError: !!state.error,
    isSourceCreated,
    isProcessing,
    processingStage,
    refreshCount,
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
            This may take a minute or two. The page will refresh automatically to show progress.
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
