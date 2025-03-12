'use client'

import React from 'react'
import { FrontmatterDisplay } from './FrontmatterDisplay'
import { ErrorDisplay } from './ErrorDisplay'
import { ContentForm } from './ContentForm'
import { LLMSourceNoteDisplay } from './llm/LLMSourceNoteDisplay'
import { ProgressIndicator } from './llm/ProgressIndicator'
import { SourcePageLayout } from './SourcePageLayout'
import { useSourceForm } from './hooks/useSourceForm'

export default function SourceUploader() {
  const {
    content,
    frontmatterData,
    parseError,
    state,
    isSubmitting,
    handleContentChange,
    handleFormAction,
  } = useSourceForm()

  return (
    <SourcePageLayout title="Source Uploader">
      <p>Paste markdown content with frontmatter below:</p>

      <ContentForm
        content={content}
        onContentChange={handleContentChange}
        frontmatterData={frontmatterData}
        // @ts-ignore
        formAction={handleFormAction}
        isSubmitting={isSubmitting}
      />

      <ProgressIndicator isProcessing={isSubmitting} />

      {frontmatterData && <FrontmatterDisplay data={frontmatterData} />}
      {parseError && <ErrorDisplay error={parseError} />}
      {state.error && <ErrorDisplay error={state.error} />}
      {state.result && <LLMSourceNoteDisplay result={state.result} />}
    </SourcePageLayout>
  )
}
