'use server'

import { processSourceWithLLM } from './llm/sourcePrompt'
import { getPayload } from 'payload'
import config from '@payload-config'
import { parseFrontmatter, extractSourceFields } from './frontmatterParser'

// Main server action exported for form handling
export async function processSourceAction(prevState: any, formData: FormData) {
  try {
    const content = formData.get('content')
    if (!content) {
      return { ...prevState, error: 'No content provided', processed: true }
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
        result: { content: result },
        error: 'The LLM response was not valid JSON',
        processed: true,
      }
    }

    // Check for missing required fields
    const missingRequiredFields = ['title', 'url'].filter((field) => !parsedResult[field])

    if (missingRequiredFields.length > 0) {
      return {
        result: parsedResult,
        error: `Missing required fields: ${missingRequiredFields.join(', ')}`,
        processed: true,
        sourceCreated: false,
        frontmatterMissingFields:
          frontmatterMissingFields.length > 0 ? frontmatterMissingFields : null,
      }
    }

    // @ts-ignore
    const payload = await getPayload({ config })
    try {
      const newSource = await payload.create({
        collection: 'sources',
        data: parsedResult,
      })

      return {
        result: { ...parsedResult, id: newSource.id },
        error: null,
        processed: true,
        sourceCreated: true,
        sourceId: newSource.id,
        frontmatterDetected: frontmatterPresent,
      }
    } catch (createError: any) {
      console.error('Failed to create source document:', createError, createError.data)
      return {
        result: parsedResult,
        error: `Failed to save to database: ${createError.message}`,
        processed: true,
        sourceCreated: false,
      }
    }
  } catch (error: any) {
    return {
      result: null,
      error: error.message || 'An error occurred while processing the content',
      processed: true,
    }
  }
}
