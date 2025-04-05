'use server'

import { processSourceWithLLM } from '../llm/sourcePrompt'

// List of fields that need to be processed as arrays of {text: string} objects
export const ARRAY_FIELDS = [
  'mainPoints',
  'bulletSummary',
  'peopleplacesthingsevents',
  'quotations',
  'details',
]

/**
 * Process content with LLM and format the response
 */
export async function processContentWithLLM(content: string) {
  try {
    // Process the content with LLM
    const result = await processSourceWithLLM(content, process.env.ANTHROPIC_API_KEY || '')

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

      // Process array fields from LLM response
      parsedResult = await convertStringArrayFields(parsedResult)

      return { success: true, parsedResult }
    } catch (parseError) {
      console.error('Failed to parse LLM response as JSON:', parseError)
      return {
        success: false,
        error: 'The LLM response was not valid JSON',
        result,
      }
    }
  } catch (error) {
    console.error('Error processing content with LLM:', error)
    return { success: false, error }
  }
}

/**
 * Convert string arrays to the expected array of objects format
 */
export async function convertStringArrayFields(data: any): Promise<any> {
  if (!data) return data

  const result = { ...data }

  ARRAY_FIELDS.forEach((field) => {
    // If the field exists in the data and is a string, convert it to array format
    if (result[field] && typeof result[field] === 'string') {
      const textValue = result[field]
      result[field] = textValue
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => ({ text: line }))

      console.log(`Converted LLM ${field} from string to array format`)
    }
  })

  return result
}

/**
 * Process FormData fields that might contain array data
 */
export async function processFormArrayFields(formData: FormData, frontmatterFieldsFromForm: any) {
  const processedFields = { ...frontmatterFieldsFromForm }

  ARRAY_FIELDS.forEach((field) => {
    const fieldValue = formData.get(field)
    if (fieldValue && typeof fieldValue === 'string') {
      try {
        // Try to parse as JSON array
        const parsedArray = JSON.parse(fieldValue)
        if (Array.isArray(parsedArray)) {
          // Use type-safe indexer with explicit any type
          ;(processedFields as any)[field] = parsedArray
          console.log(`Using pre-processed array for ${field} from form data`)
        }
      } catch (e) {
        // If parsing fails, leave the field as is
        console.warn(`Failed to parse ${field} as JSON array, keeping existing value`)
      }
    }
  })

  return processedFields
}
