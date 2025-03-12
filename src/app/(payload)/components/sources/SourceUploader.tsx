'use client'

import { FrontmatterDisplay } from './FrontmatterDisplay'
import { ErrorDisplay } from './ErrorDisplay'
import { ContentForm } from './ContentForm'
import { LLMResponseDisplay } from './llm/LLMResponseDisplay'
import { SourcePageLayout } from './SourcePageLayout'
import { useSourceForm } from './hooks/useSourceForm'

export default function SourceUploader() {
  const { content, frontmatterData, parseError, state, handleContentChange, handleFormAction } =
    useSourceForm()

  return (
    <SourcePageLayout title="Source Uploader">
      <p>Paste markdown content with frontmatter below:</p>

      <ContentForm
        content={content}
        onContentChange={handleContentChange}
        frontmatterData={frontmatterData}
        formAction={handleFormAction}
      />

      {frontmatterData && <FrontmatterDisplay data={frontmatterData} />}
      {parseError && <ErrorDisplay error={parseError} />}
      {state.error && <ErrorDisplay error={state.error} />}
      {state.result && <LLMResponseDisplay result={state.result.content} />}
    </SourcePageLayout>
  )
}
