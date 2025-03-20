'use client'

import { FrontmatterDisplay } from './FrontmatterDisplay'
import { ErrorDisplay } from './ErrorDisplay'
import { ContentForm } from './ContentForm'
import { LLMResponseDisplay } from './llm/LLMResponseDisplay'
import { SourcePageLayout } from './SourcePageLayout'
import { SourceConfirmation } from './SourceConfirmation'
import { useSourceForm } from './hooks/useSourceForm'
import { AtomsDisplay } from './atoms/AtomsDisplay'
import { LoadingIndicator } from './LoadingIndicator'
import { CategoryDropdown } from './CategoryDropdown'

// Sidebar wrapper component for consistent styling
const Sidebar = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
    <h3 className="m-0 mb-5 text-lg text-slate-100 border-b border-slate-700 pb-3">
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
    selectedCategory,
    handleContentChange,
    handleCategoryChange,
    handleFormAction,
    isSourceCreated,
    sourceData,
  } = useSourceForm()

  // Determine loading state and stage
  const isProcessing = state.isProcessing
  const processingStage = state.processingStage

  // For debugging
  console.log('State:', {
    processed: state.processed,
    sourceCreated: state.sourceCreated,
    hasResult: !!state.result,
    hasError: !!state.error,
    isSourceCreated,
    isProcessing,
    processingStage,
    selectedCategory,
  })

  // Sidebar content with frontmatter validator and atoms (if available)
  const sidebar = (
    <Sidebar>
      <CategoryDropdown
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        required={true}
      />

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
      <p className="my-8">Paste markdown content with frontmatter below:</p>

      <ContentForm
        content={content}
        onContentChange={handleContentChange}
        frontmatterData={frontmatterData}
        formAction={handleFormAction}
        isProcessing={isProcessing}
        selectedCategory={selectedCategory}
      />

      {/* Show loading indicator when processing */}
      {isProcessing && <LoadingIndicator isProcessing={isProcessing} stage={processingStage} />}

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
