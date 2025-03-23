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
export async function fetchAllVectors(): Promise<VectorData[]> {
  if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY is not set')
  }

  // Initialize Pinecone client
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })

  // Access the 'fleet' index (no need to specify URL in v5)
  const index = pc.index('fleet')
  const atomsNamespace = index.namespace('atoms')

  try {
    // 1. Fetch all vectors from Pinecone
    // Create a dummy vector of the right dimension for Llama-text-embed-v2
    const dimension = 1024 // Changed from 1536 to 1024 for Llama
    const dummyVector = Array(dimension).fill(0)

    // Query with a dummy vector to get all vectors
    const queryResponse = await atomsNamespace.query({
      vector: dummyVector,
      topK: 1000, // Adjust based on expected number of atoms
      includeMetadata: true,
      includeValues: true,
    })

    // Transform the response to our expected format
    const vectorDataArray: VectorData[] = []

    for (const match of queryResponse.matches) {
      if (match.values) {
        vectorDataArray.push({
          id: match.id,
          vector: match.values,
          metadata: match.metadata || {},
        })
      }
    }

    // Return vectors without atom data
    return vectorDataArray
  } catch (error) {
    console.error('Error fetching vectors:', error)
    throw new Error('Failed to fetch vectors')
  }
}

/**
 * Fetches a single atom by its Pinecone ID
 */
export async function fetchAtomById(pineconeId: string): Promise<AtomData | null> {
  if (!pineconeId) return null

  try {
    const payload = await getPayload({ config, importMap: {} })

    // Query for atoms with matching pineconeId
    const { docs: atoms } = await payload.find({
      collection: 'atoms',
      where: {
        pineconeId: { equals: pineconeId },
      },
      depth: 1, // Include one level of relationships (for source)
    })

    // If no atom found with this pineconeId
    if (!atoms || atoms.length === 0) {
      return null
    }

    const atom = atoms[0]

    // Transform the atom data with proper type handling
    return {
      id: atom.id.toString(),
      title: atom.title || undefined,
      mainContent: atom.mainContent || undefined,
      supportingQuote: atom.supportingQuote || undefined,
      supportingInfo: Array.isArray(atom.supportingInfo)
        ? atom.supportingInfo.map((info) => ({ text: info.text || '' }))
        : undefined,
      source: atom.source
        ? {
            id: typeof atom.source === 'object' ? atom.source.id.toString() : '',
            title: typeof atom.source === 'object' ? atom.source.title || undefined : undefined,
          }
        : undefined,
    }
  } catch (error) {
    console.error(`Error fetching atom with ID ${pineconeId}:`, error)
    return null
  }
}
