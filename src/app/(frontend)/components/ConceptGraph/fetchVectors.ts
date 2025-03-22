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
 * and enriches them with atom data from Payload CMS
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

    // 2. Fetch all atoms from Payload CMS
    const payload = await getPayload({ config, importMap: {} })
    const { docs: atoms } = await payload.find({
      collection: 'atoms',
      depth: 1, // Include one level of relationships (for source)
    })

    // 3. Create a lookup map of atoms by pineconeId
    const atomsByPineconeId = atoms.reduce<Record<string, any>>((map: any, atom: any) => {
      if (atom.pineconeId) {
        map[atom.pineconeId] = atom
      }
      return map
    }, {})

    // 4. Enrich vectors with atom data
    return vectorDataArray.map((vector) => {
      const atom = atomsByPineconeId[vector.id]

      return {
        ...vector,
        atomData: atom
          ? {
              id: atom.id,
              title: atom.title,
              mainContent: atom.mainContent,
              supportingQuote: atom.supportingQuote,
              supportingInfo: atom.supportingInfo,
              source: atom.source
                ? {
                    id: atom.source.id,
                    title: atom.source.title,
                  }
                : undefined,
            }
          : null,
      }
    })
  } catch (error) {
    console.error('Error fetching data:', error)
    throw new Error('Failed to fetch vectors and atom data')
  }
}
