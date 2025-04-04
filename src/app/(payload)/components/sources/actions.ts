'use server'

import { processSourceWithLLM } from './llm/sourcePrompt'
import { getPayload } from 'payload'
import config from '@payload-config'
import { parseFrontmatter, extractSourceFields } from './frontmatterParser'
import { createAtomsFromSource } from './atoms/atomsProcessor'
import { upsertSourceVectors } from './vectors/actions'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'

// List of fields that need to be processed as arrays of {text: string} objects
const ARRAY_FIELDS = [
  'mainPoints',
  'bulletSummary',
  'peopleplacesthingsevents',
  'quotations',
  'details',
]

// Main server action exported for form handling
export async function processSourceAction(prevState: any, formData: FormData) {
  try {
    const content = formData.get('content')
    const sourceCategory = formData.get('sourceCategory')

    console.log('Received form data:', {
      content: content ? 'yes (too large to show)' : 'no',
      sourceCategory,
    })

    // Log all form data keys for debugging
    console.log('Form data fields:', Array.from(formData.keys()))

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

      // Process array fields from LLM response
      ARRAY_FIELDS.forEach((field) => {
        // If the field exists in the parsedResult and is a string, convert it to array format
        if (parsedResult[field] && typeof parsedResult[field] === 'string') {
          const textValue = parsedResult[field]
          parsedResult[field] = textValue
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
            .map((line) => ({ text: line }))

          console.log(`Converted LLM ${field} from string to array format`)
        }
      })

      // Map LLM outputs to the expected Payload field names with frontmatter fields
      // Check for array fields in the formData that were pre-processed
      const frontmatterFieldsFromForm = { ...extractSourceFields(frontmatterData) }

      // Process any JSON-stringified array fields from the form data
      ARRAY_FIELDS.forEach((field) => {
        const fieldValue = formData.get(field)
        if (fieldValue && typeof fieldValue === 'string') {
          try {
            // Try to parse as JSON array
            const parsedArray = JSON.parse(fieldValue)
            if (Array.isArray(parsedArray)) {
              // Use type-safe indexer with explicit any type
              ;(frontmatterFieldsFromForm as any)[field] = parsedArray
              console.log(`Using pre-processed array for ${field} from form data`)
            }
          } catch (e) {
            // If parsing fails, leave the field as is
            console.warn(`Failed to parse ${field} as JSON array, keeping existing value`)
          }
        }
      })

      // Merge front matter data with LLM results
      parsedResult = frontmatterData
        ? { ...parsedResult, ...frontmatterFieldsFromForm }
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

      // 1. Write content to temporary file with .txt extension
      const contentStr = content.toString()
      const tmpDir = os.tmpdir()
      const fileName = `source-${Date.now()}.txt`
      const filePath = path.join(tmpDir, fileName)

      await fs.writeFile(filePath, contentStr)
      console.log(`Content written to temporary file: ${filePath}`)

      // 2. Upload the file to Media collection
      let mediaDoc
      try {
        // Create a buffer from the content string
        const buffer = Buffer.from(contentStr)

        // Create a Payload-compatible file object
        const payloadFile = {
          data: buffer,
          mimetype: 'text/plain',
          name: fileName,
          size: buffer.length,
        }

        mediaDoc = await payload.create({
          collection: 'media',
          data: {
            alt: parsedResult.title || 'Source content',
          },
          file: payloadFile,
        })

        console.log(`File uploaded to Media collection with ID: ${mediaDoc.id}`)
      } catch (uploadError) {
        console.error('Failed to upload file to Media collection:', uploadError)
        throw uploadError
      } finally {
        // Clean up: remove the temporary file
        try {
          await fs.unlink(filePath)
          console.log(`Temporary file removed: ${filePath}`)
        } catch (unlinkError) {
          console.error('Failed to remove temporary file:', unlinkError)
        }
      }

      // For relationships, Payload may need the ID as a number instead of string
      const createData = {
        ...parsedResult,
        sourceCategory: Number(sourceCategory),
        // 3. Add the media document ID to the source document
        fullText: mediaDoc.id,
      }

      console.log('Category ID being submitted (as number):', Number(sourceCategory))
      console.log(`Media ID being linked to source: ${mediaDoc.id}`)

      // Log the array field structure to verify format
      ARRAY_FIELDS.forEach((field) => {
        if (createData[field]) {
          console.log(
            `Field ${field} structure:`,
            Array.isArray(createData[field])
              ? `Array with ${createData[field].length} items`
              : typeof createData[field],
          )
        }
      })

      console.log(
        'Creating source with data:',
        JSON.stringify(
          {
            title: createData.title,
            url: createData.url,
            sourceCategory: createData.sourceCategory,
            // Show just the first item of each array field
            mainPoints: Array.isArray(createData.mainPoints)
              ? [createData.mainPoints[0], '...']
              : '...',
            bulletSummary: Array.isArray(createData.bulletSummary)
              ? [createData.bulletSummary[0], '...']
              : '...',
            quotations: Array.isArray(createData.quotations)
              ? [createData.quotations[0], '...']
              : '...',
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

      // After creating the source, embed it in Pinecone
      let embeddingResult = null
      if (newSource && newSource.id) {
        try {
          console.log('Creating vector embedding for source document...')
          embeddingResult = await upsertSourceVectors(newSource)

          // Update the source document with the pineconeId
          if (embeddingResult && embeddingResult.pineconeSourceId) {
            await payload.update({
              collection: 'sources',
              id: newSource.id,
              data: {
                pineconeId: embeddingResult.pineconeSourceId,
              },
            })
            console.log(
              `Updated source ${newSource.id} with pineconeId: ${embeddingResult.pineconeSourceId}`,
            )

            // Add the pineconeId to the newSource object as well
            newSource.pineconeId = embeddingResult.pineconeSourceId
          }
        } catch (embeddingError) {
          console.error('Error creating vector embedding for source document:', embeddingError)
          // Continue with atom creation even if embedding fails
        }
      }

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
