'use server'

import { processSourceWithLLM } from './llm/sourcePrompt'
import { getPayload } from 'payload'
import config from '@payload-config'
import { parseFrontmatter, extractSourceFields } from './frontmatterParser'
import { createAtomsFromSource } from './atoms/atomsProcessor'
import { revalidatePath } from 'next/cache'

// This is the first step of the process - it validates content and queues the LLM processing
export async function processSourceAction(prevState: any, formData: FormData) {
  try {
    const content = formData.get('content')
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

    // Update state to show we're processing source
    const processingState = {
      ...prevState,
      isProcessing: true,
      processingStage: 'source',
      error: null,
      originalContent: content.toString(),
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

    if (frontmatterPresent && frontmatterMissingFields.length > 0) {
      return {
        ...processingState,
        error: `Missing required frontmatter fields: ${frontmatterMissingFields.join(', ')}`,
        processed: true,
        isProcessing: false,
        processingStage: null,
      }
    }

    // Instead of waiting for the LLM response here, immediately return with processing state
    // and start the async processing chain
    scheduleLLMProcessing(contentWithoutFrontmatter || content.toString(), frontmatterData)

    return {
      ...processingState,
      frontmatterData,
      message:
        'Processing started. This may take a minute or two. The page will update automatically when complete.',
      // Include the original content to be used in subsequent steps
      originalContent: content.toString(),
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

// This function starts the LLM processing in the background
async function scheduleLLMProcessing(content: string, frontmatterData: any) {
  try {
    // Process with LLM without awaiting to avoid timeouts
    processSourceWithLLM(content, process.env.ANTHROPIC_API_KEY || '')
      .then((result) => {
        // After LLM processing, schedule the source creation
        handleLLMResult(result, frontmatterData, content)
      })
      .catch((error) => {
        console.error('Error in LLM processing:', error)
        // Could store error in DB or other persistent storage for UI to check
      })
  } catch (error) {
    console.error('Error scheduling LLM processing:', error)
  }
}

// This function handles the LLM result and creates the source
async function handleLLMResult(result: any, frontmatterData: any, originalContent: string) {
  try {
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

      // Check for missing required fields
      const missingRequiredFields = ['title', 'url'].filter((field) => !parsedResult[field])

      if (missingRequiredFields.length > 0) {
        console.error(`Missing required fields: ${missingRequiredFields.join(', ')}`)
        return
      }

      // Create the source
      await createSourceDocument(parsedResult, originalContent)
    } catch (parseError) {
      console.error('Failed to parse LLM response as JSON:', parseError)
    }
  } catch (error) {
    console.error('Error handling LLM result:', error)
  }
}

// This function creates the source document and triggers atom generation
async function createSourceDocument(sourceData: any, originalContent: string) {
  try {
    // @ts-ignore
    const payload = await getPayload({ config })

    // Create the source document
    const newSource = await payload.create({
      collection: 'sources',
      data: sourceData,
    })

    // After creating the source, schedule atom generation
    if (newSource && newSource.id) {
      // Again, don't await to avoid timeouts
      createAtomsFromSource(newSource, originalContent)
        .then(() => {
          // Revalidate the path to update UI
          revalidatePath('/admin/source-uploader')
          revalidatePath('/admin/collections/sources')
        })
        .catch((error) => {
          console.error('Error creating atoms:', error)
        })
    }
  } catch (error) {
    console.error('Error creating source document:', error)
  }
}

// New function to check processing status
export async function checkProcessingStatus(sourceId: string) {
  try {
    // @ts-ignore
    const payload = await getPayload({ config })

    // Check if source exists
    const source = await payload.findByID({
      collection: 'sources',
      id: sourceId,
    })

    if (!source) {
      return { isProcessing: true, stage: 'source' }
    }

    // Check if atoms exist for this source
    const atoms = await payload.find({
      collection: 'atoms',
      where: {
        source: {
          equals: sourceId,
        },
      },
    })

    if (!atoms || atoms.docs.length === 0) {
      return { isProcessing: true, stage: 'atoms' }
    }

    // Processing is complete
    return { isProcessing: false, stage: null }
  } catch (error) {
    console.error('Error checking processing status:', error)
    return { isProcessing: false, stage: null, error: 'Error checking status' }
  }
}
