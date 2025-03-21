'use server'

import { processSourceWithLLM } from './llm/sourcePrompt'
import { getPayload } from 'payload'
import config from '@payload-config'
import { parseFrontmatter, extractSourceFields } from './frontmatterParser'
import { createAtomsFromSource } from './atoms/atomsProcessor'

// Main server action exported for form handling
export async function processSourceAction(prevState: any, formData: FormData) {
  try {
    const content = formData.get('content')
    const sourceCategory = formData.get('sourceCategory')

    console.log('Received form data:', {
      content: content ? 'yes (too large to show)' : 'no',
      sourceCategory,
    })

    if (!content) {
      return {
        ...prevState,
        error: 'No content provided',
        processed: true,
        sourceCreated: false,
        isProcessing: false,
        processingStage: null,
      }
    }

    if (!sourceCategory) {
      return {
        ...prevState,
        error: 'Source category is required',
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

    // Parse frontmatter from content
    const {
      data: frontmatterData,
      error: frontmatterError,
      content: contentWithoutFrontmatter,
    } = parseFrontmatter(content.toString())

    if (frontmatterError) {
      console.warn('Frontmatter parsing warning:', frontmatterError)
    }

    // Check if we have frontmatter but missing required fields
    const frontmatterPresent = frontmatterData && Object.keys(frontmatterData).length > 0
    const frontmatterMissingFields = frontmatterPresent
      ? ['title', 'url'].filter((field) => !frontmatterData[field])
      : []

    // Pass the content without frontmatter to the LLM
    const result = await processSourceWithLLM(
      contentWithoutFrontmatter || content.toString(),
      process.env.ANTHROPIC_API_KEY || '',
    )

    // Update state to show we've completed source processing
    const sourceProcessedState = {
      ...processingState,
      result,
      processingStage: 'atoms',
    }

    // Parse the result as JSON if it's a string
    let parsedResult: any
    try {
      // Handle the case where result might be {content: "json string"}
      if (typeof result === 'object' && result !== null && typeof result.content === 'string') {
        parsedResult = JSON.parse(result.content)
      } else {
        // Otherwise handle as before
        parsedResult = typeof result === 'string' ? JSON.parse(result) : result
      }

      // Check if the required LLM output fields exist
      const expectedFields = [
        'oneSentenceSummary',
        'mainPoints',
        'bulletSummary',
        'peopleplacesthingsevents',
        'details',
        'quotations',
      ]
      const missingLlmFields = expectedFields.filter((field) => !parsedResult[field])

      if (missingLlmFields.length > 0) {
        console.warn(`LLM response missing fields: ${missingLlmFields.join(', ')}`)
      }

      // Map LLM outputs to the expected Payload field names with frontmatter fields
      parsedResult = frontmatterData
        ? { ...parsedResult, ...extractSourceFields(frontmatterData) }
        : parsedResult
    } catch (parseError) {
      console.error('Failed to parse LLM response as JSON:', parseError)
      return {
        ...sourceProcessedState,
        result: { content: result },
        error: 'The LLM response was not valid JSON',
        processed: true,
        sourceCreated: false,
        isProcessing: false,
        processingStage: null,
      }
    }

    // Check for missing required fields
    const missingRequiredFields = ['title', 'url'].filter((field) => !parsedResult[field])

    if (missingRequiredFields.length > 0) {
      return {
        ...sourceProcessedState,
        result: parsedResult,
        error: `Missing required fields: ${missingRequiredFields.join(', ')}`,
        processed: true,
        sourceCreated: false,
        isProcessing: false,
        processingStage: null,
        frontmatterMissingFields:
          frontmatterMissingFields.length > 0 ? frontmatterMissingFields : null,
      }
    }

    // @ts-ignore
    const payload = await getPayload({ config })
    try {
      // Update state to show we're in atoms generation stage
      const atomsProcessingState = {
        ...sourceProcessedState,
        processingStage: 'atoms',
      }

      // For relationships, Payload may need the ID as a number instead of string
      const createData = {
        ...parsedResult,
        sourceCategory: Number(sourceCategory),
        fullText: content.toString(),
      }

      console.log('Category ID being submitted (as number):', Number(sourceCategory))

      console.log(
        'Creating source with data:',
        JSON.stringify(
          {
            ...createData,
            // Don't log the long text fields
            details: '...',
            mainPoints: '...',
            quotations: '...',
          },
          null,
          2,
        ),
      )

      // Directly use the payload.create method with minimal options
      const newSource = await payload.create({
        collection: 'sources',
        data: createData,
        depth: 0, // No need to populate relationships for creation
      })

      // After successfully creating the source, create atoms
      let atomsResult = null
      if (newSource && newSource.id) {
        atomsResult = await createAtomsFromSource(
          newSource,
          content.toString(), // Pass the original content
        )
      }

      return {
        ...atomsProcessingState,
        result: newSource,
        atomsResult,
        error: null,
        processed: true,
        sourceCreated: true,
        isProcessing: false,
        processingStage: null,
      }
    } catch (createError: any) {
      console.error('Failed to create source document:', createError, createError.data)
      return {
        ...sourceProcessedState,
        result: parsedResult,
        error: `Failed to save to database: ${createError.message}`,
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
