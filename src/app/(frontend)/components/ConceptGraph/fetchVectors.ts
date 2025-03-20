'use server'

import { Pinecone } from '@pinecone-database/pinecone'

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
}

/**
 * Fetches vectors from the Pinecone 'atoms' namespace
 * This is a server action that returns the vector data needed for visualization
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
    // Create a dummy vector of the right dimension for Llama-text-embed-v2
    const dimension = 1024 // Changed from 1536 to 1024 for Llama
    const dummyVector = Array(dimension).fill(0)

    // Query with a dummy vector to get all vectors
    // This is a workaround since there's no direct "fetch all" operation
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

    return vectorDataArray
  } catch (error) {
    console.error('Error fetching vectors from Pinecone:', error)
    throw new Error('Failed to fetch vectors from Pinecone')
  }
}
