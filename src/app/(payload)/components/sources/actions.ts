'use server'

import { parseFrontmatter, extractSourceFields } from './frontmatterParser'
import { createAtomsFromSource } from './atoms/atomsProcessor'

// Import our new modular processors
import { processSourceMedia } from './processors/mediaProcessor'
import { createSourceDocument, addVectorToSource } from './processors/sourceProcessor'
import {
  processContentWithLLM,
  processFormArrayFields,
  ARRAY_FIELDS,
} from './processors/llmProcessor'
import {
  validateSourceBasics,
  validateSourceData,
  validateFrontmatter,
} from './processors/validationProcessor'

// Main server action exported for form handling
export async function processSourceAction(prevState: any, formData: FormData) {
  try {
    // Get content and category from form data
    const content = formData.get('content')
    const sourceCategory = formData.get('sourceCategory')

    console.log('Received form data:', {
      content: content ? 'yes (too large to show)' : 'no',
      sourceCategory,
    })
    console.log('Form data fields:', Array.from(formData.keys()))

    // Step 1: Validate basic requirements
    const basicValidation = await validateSourceBasics(
      content?.toString() || null,
      sourceCategory?.toString() || null,
    )
    if (!basicValidation.valid) {
      return {
        ...prevState,
        error: basicValidation.errors.join(', '),
        processed: true,
        sourceCreated: false,
        isProcessing: false,
        processingStage: null,
      }
    }

    // Update state to show we're processing source
    const processingState = {
      ...prevState,
      isProcessing: true,
      processingStage: 'source',
      error: null,
    }

    // Step 2: Parse frontmatter from content
    const {
      data: frontmatterData,
      error: frontmatterError,
      content: contentWithoutFrontmatter,
    } = parseFrontmatter(content!.toString())

    if (frontmatterError) {
      console.warn('Frontmatter parsing warning:', frontmatterError)
    }

    // Validate frontmatter data if present
    const frontmatterValidation = await validateFrontmatter(frontmatterData)
    const frontmatterMissingFields = frontmatterValidation.missingFields

    // Step 3: Process content with LLM
    const llmResult = await processContentWithLLM(contentWithoutFrontmatter || content!.toString())

    // Update state to show we've completed source processing
    const sourceProcessedState = {
      ...processingState,
      result: llmResult.parsedResult || llmResult.result,
      processingStage: 'atoms',
    }

    // Handle LLM processing errors
    if (!llmResult.success) {
      return {
        ...sourceProcessedState,
        result: llmResult.result,
        error: llmResult.error || 'Error processing with LLM',
        processed: true,
        sourceCreated: false,
        isProcessing: false,
        processingStage: null,
      }
    }

    // Step 4: Process data from the LLM and frontmatter
    let parsedResult = llmResult.parsedResult

    // Extract frontmatter fields and process form array fields
    const frontmatterFieldsFromForm = { ...extractSourceFields(frontmatterData) }
    const processedFormFields = await processFormArrayFields(formData, frontmatterFieldsFromForm)

    // Merge frontmatter data with LLM results
    parsedResult = frontmatterData ? { ...parsedResult, ...processedFormFields } : parsedResult

    // Step 5: Validate the merged data
    const dataValidation = await validateSourceData(parsedResult)
    if (!dataValidation.valid) {
      return {
        ...sourceProcessedState,
        result: parsedResult,
        error: `Missing required fields: ${dataValidation.missingFields.join(', ')}`,
        processed: true,
        sourceCreated: false,
        isProcessing: false,
        processingStage: null,
        frontmatterMissingFields:
          frontmatterMissingFields.length > 0 ? frontmatterMissingFields : null,
      }
    }

    try {
      // Update state to show we're in atoms generation stage
      const atomsProcessingState = {
        ...sourceProcessedState,
        processingStage: 'atoms',
      }

      // Step 6: Process and upload the media file
      const mediaResult = await processSourceMedia(
        parsedResult.title || 'Source content',
        content!.toString(),
      )

      if (!mediaResult.success || !mediaResult.mediaDoc) {
        return {
          ...atomsProcessingState,
          error: 'Failed to process media',
          processed: true,
          sourceCreated: false,
          isProcessing: false,
          processingStage: null,
        }
      }

      // Step 7: Create the source document
      const sourceResult = await createSourceDocument(
        parsedResult,
        Number(sourceCategory),
        mediaResult.mediaDoc.id.toString(), // Convert to string to satisfy type check
      )

      if (!sourceResult.success) {
        return {
          ...atomsProcessingState,
          result: parsedResult,
          error:
            typeof sourceResult.error === 'object'
              ? (sourceResult.error as Error)?.message || 'Failed to create source'
              : String(sourceResult.error) || 'Failed to create source',
          processed: true,
          sourceCreated: false,
          isProcessing: false,
          processingStage: null,
        }
      }

      const newSource = sourceResult.newSource

      // Step 8: Add vector embedding to source
      const vectorResult = await addVectorToSource(newSource)
      const sourceWithVector = vectorResult.source || newSource

      // Step 9: Create atoms from the source
      let atomsResult = null
      if (sourceWithVector && sourceWithVector.id) {
        atomsResult = await createAtomsFromSource(
          sourceWithVector,
          content!.toString(), // Pass the original content
        )
      }

      return {
        ...atomsProcessingState,
        result: sourceWithVector,
        atomsResult,
        error: null,
        processed: true,
        sourceCreated: true,
        isProcessing: false,
        processingStage: null,
      }
    } catch (error: any) {
      console.error('Processing error:', error)
      return {
        ...sourceProcessedState,
        result: parsedResult,
        error: error.message || 'An error occurred while processing',
        processed: true,
        sourceCreated: false,
        isProcessing: false,
        processingStage: null,
      }
    }
  } catch (error: any) {
    return {
      ...prevState,
      result: null,
      error: error.message || 'An error occurred while processing the content',
      processed: true,
      sourceCreated: false,
      isProcessing: false,
      processingStage: null,
    }
  }
}
