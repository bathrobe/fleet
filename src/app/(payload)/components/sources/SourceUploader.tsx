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
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/card'

// Sidebar wrapper component for consistent styling
const Sidebar = ({ children }: { children: React.ReactNode }) => (
  <Card className="border bg-card/50 shadow-sm">
    <CardHeader className="pb-3 border-b">
      <CardTitle className="text-lg font-medium">Document Info</CardTitle>
    </CardHeader>
    <CardContent className="p-5">{children}</CardContent>
  </Card>
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
      <p className="text-muted-foreground mb-6">Paste markdown content with frontmatter below:</p>

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
