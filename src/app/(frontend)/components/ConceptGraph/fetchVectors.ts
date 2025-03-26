'use server'

import { Pinecone } from '@pinecone-database/pinecone'
import { getPayload } from 'payload'
import config from '@/payload.config'

export type AtomData = {
  id: string
  title?: string
  mainContent?: string
  supportingQuote?: string
  supportingInfo?: { text: string }[]
  source?: {
    id: string
    title?: string
    url?: string
    author?: string
    publishedDate?: string
    tags?: any[]
    oneSentenceSummary?: string
    mainPoints?: { text: string }[]
    bulletSummary?: { text: string }[]
    peopleplacesthingsevents?: { text: string }[]
    quotations?: { text: string }[]
    details?: { text: string }[]
    sourceCategory?: any
  }
}

export type VectorData = {
  id: string
  vector: number[]
  metadata: {
    payloadAtomId?: string
    payloadSourceId?: string
    payloadSourceCategoryId?: string
    text?: string
    [key: string]: any
  }
  atomData?: AtomData | null
}

/**
 * Fetches vectors from the Pinecone 'atoms' namespace
 * and does NOT fetch atom data - only returns vector data
 */
export async function fetchVectors(): Promise<VectorData[]> {
  try {
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' })
    const index = pc.index('fleet')
    const atomsNamespace = index.namespace('atoms')

    // Query for all vectors, including synthesized ones
    const dimension = 1024
    const dummyVector = Array(dimension).fill(0)

    const response = await atomsNamespace.query({
      vector: dummyVector,
      topK: 1000, // Adjust based on your data size
      includeMetadata: true,
      includeValues: true,
    })

    // @ts-expect-error
    return response.matches.map((match) => ({
      id: match.id,
      vector: match.values,
      metadata: match.metadata,
      isSynthesized: match.metadata?.type === 'synthesized',
    }))
  } catch (error) {
    console.error('Error fetching vectors:', error)
    return []
  }
}

/**
 * Fetches a specific atom by its Pinecone ID
 */
export async function fetchAtomById(pineconeId: string): Promise<AtomData | null> {
  if (!pineconeId) return null

  try {
    // First, get the vector from Pinecone to determine its type
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' })
    const index = pc.index('fleet')
    const atomsNamespace = index.namespace('atoms')

    const vectorResponse = await atomsNamespace.fetch([pineconeId])

    if (!vectorResponse.records[pineconeId]) {
      throw new Error(`Vector with ID ${pineconeId} not found`)
    }

    const metadata = vectorResponse.records[pineconeId].metadata
    const isSynthesized = metadata?.type === 'synthesized'

    // For debugging
    console.log(
      'Fetching atom by ID:',
      pineconeId,
      'Type:',
      isSynthesized ? 'synthesized' : 'regular',
    )

    // Get atom data from the CMS based on type
    const payload = await getPayload({ config })
    let atomData

    if (isSynthesized) {
      // For synthesized atoms, the payloadAtomId is stored in metadata
      const payloadId = metadata?.payloadAtomId
      if (!payloadId) throw new Error('Missing payload ID for synthesized atom')

      atomData = await payload.findByID({
        collection: 'synthesizedAtoms',
        id: payloadId as string,
        depth: 2, // Include parent atoms
      })
    } else {
      // For regular atoms, we need to find by pineconeId
      const atomsResponse = await payload.find({
        collection: 'atoms',
        where: {
          pineconeId: { equals: pineconeId },
        },
        depth: 2, // Include source and related data
      })

      if (!atomsResponse.docs || atomsResponse.docs.length === 0) {
        throw new Error(`No atom found with pineconeId: ${pineconeId}`)
      }

      atomData = atomsResponse.docs[0]
    }

    return {
      ...atomData,
      // @ts-expect-error
      metadata,
      isSynthesized,
    }
  } catch (error) {
    console.error('Error fetching atom by ID:', error)
    return null
  }
}
