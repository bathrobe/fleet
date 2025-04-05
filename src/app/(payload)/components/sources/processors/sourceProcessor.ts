'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { upsertSourceVectors } from '../vectors/actions'

/**
 * Create a source document in Payload CMS
 */
export async function createSourceDocument(sourceData: any, categoryId: number, mediaId: string) {
  try {
    // Get payload instance
    const payload = await getPayload({ config })

    // Create the source document with the source data, category, and media reference
    const createData = {
      ...sourceData,
      sourceCategory: Number(categoryId),
      fullText: mediaId, // Link to the uploaded media document
    }

    console.log(
      'Creating source with data:',
      JSON.stringify(
        {
          title: createData.title,
          url: createData.url,
          sourceCategory: createData.sourceCategory,
          // Show just enough data for debugging, not the full source
        },
        null,
        2,
      ),
    )

    // Create the source in Payload
    const newSource = await payload.create({
      collection: 'sources',
      data: createData,
      depth: 0, // No need to populate relationships for creation
    })

    return { success: true, newSource }
  } catch (error) {
    console.error('Failed to create source document:', error)
    return { success: false, error }
  }
}

/**
 * Add vector embedding to the source document
 */
export async function addVectorToSource(source: any) {
  try {
    // Get payload instance
    const payload = await getPayload({ config })

    console.log('Creating vector embedding for source document...')
    const embeddingResult = await upsertSourceVectors(source)

    // Update the source document with the pineconeId
    if (embeddingResult && embeddingResult.pineconeSourceId) {
      await payload.update({
        collection: 'sources',
        id: source.id,
        data: {
          pineconeId: embeddingResult.pineconeSourceId,
        },
      })

      console.log(
        `Updated source ${source.id} with pineconeId: ${embeddingResult.pineconeSourceId}`,
      )

      // Return updated source data
      return {
        success: true,
        pineconeId: embeddingResult.pineconeSourceId,
        source: {
          ...source,
          pineconeId: embeddingResult.pineconeSourceId,
        },
      }
    }

    return { success: true, source }
  } catch (error) {
    console.error('Error creating vector embedding for source document:', error)
    // We return success true because this is not a critical failure
    // and we want the flow to continue
    return { success: true, source }
  }
}
