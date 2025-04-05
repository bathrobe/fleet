'use server'

import { Pinecone } from '@pinecone-database/pinecone'
import { getPayload } from 'payload'
import config from '@/payload.config'

export type AtomData = {
  id: string | number
  title?: string | null
  mainContent?: string | null
  supportingQuote?: string | null
  supportingInfo?: { text: string }[] | { text?: string | null; id?: string | null }[] | null
  isSynthesized?: boolean
  isSource?: boolean
  pineconeId?: string | null
  parentAtoms?: Array<{
    id: string | number
    title?: string | null
    mainContent?: string | null
    pineconeId?: string
  }> | null
  source?: {
    id: string | number
    title?: string | null
    url?: string | null
    author?: string | null
    publishedDate?: string | null
    tags?: any[] | null
    oneSentenceSummary?: string | null
    mainPoints?: { text: string }[] | null
    bulletSummary?: { text: string }[] | null
    peopleplacesthingsevents?: { text: string }[] | null
    quotations?: { text: string }[] | null
    details?: { text: string }[] | null
    sourceCategory?: any
  } | null
  metadata?: any
  [key: string]: any // Allow additional properties
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
 * Fetches vectors from both the Pinecone 'atoms' and 'sources' namespaces
 * and does NOT fetch atom data - only returns vector data
 */
export async function fetchVectors(): Promise<VectorData[]> {
  try {
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' })
    const index = pc.index('fleet')
    const atomsNamespace = index.namespace('atoms')
    const sourcesNamespace = index.namespace('sources')

    // Query dimensions
    const dimension = 1024
    const dummyVector = Array(dimension).fill(0)

    // Maximum vectors to fetch from each namespace
    const maxResults = 500

    // Fetch from atoms namespace (includes synthesized and regular atoms)
    const atomsResponse = await atomsNamespace.query({
      vector: dummyVector,
      topK: maxResults,
      includeMetadata: true,
      includeValues: true,
    })

    // Log for debugging
    console.log('Atoms namespace response:', {
      matches: atomsResponse.matches.length,
      sampleMetadata: atomsResponse.matches.slice(0, 3).map((m) => m.metadata),
    })

    // Fetch from sources namespace
    const sourcesResponse = await sourcesNamespace.query({
      vector: dummyVector,
      topK: maxResults,
      includeMetadata: true,
      includeValues: true,
    })

    // Log for debugging
    console.log('Sources namespace response:', {
      matches: sourcesResponse.matches.length,
      sampleMetadata: sourcesResponse.matches.slice(0, 3).map((m) => m.metadata),
    })

    // Combine and process atom results
    const atomVectors = atomsResponse.matches
      .filter((match) => match.values) // Ensure values exist
      .map((match) => ({
        id: match.id,
        vector: match.values as number[],
        metadata: {
          ...(match.metadata || {}),
          // Ensure we properly mark the source of this vector
          vectorSource: 'atoms',
        },
        isSynthesized: match.metadata?.type === 'synthesized',
      }))

    // Process source results
    const sourceVectors = sourcesResponse.matches
      .filter((match) => match.values) // Ensure values exist
      .map((match) => ({
        id: match.id,
        vector: match.values as number[],
        metadata: {
          ...(match.metadata || {}),
          // Ensure we properly mark the source of this vector
          vectorSource: 'sources',
          // If it's from the sources namespace, it should be treated as a source
          payloadSourceId:
            (match.metadata?.payloadId as string) || (match.metadata?.payloadSourceId as string),
        },
      }))

    // Combine all vectors
    return [...atomVectors, ...sourceVectors]
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
    // First attempt to fetch from atoms namespace
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' })
    const index = pc.index('fleet')
    const atomsNamespace = index.namespace('atoms')

    let vectorResponse = await atomsNamespace.fetch([pineconeId])
    let isFromSourcesNamespace = false

    // If not found in atoms, try sources namespace
    if (!vectorResponse.records[pineconeId]) {
      const sourcesNamespace = index.namespace('sources')
      vectorResponse = await sourcesNamespace.fetch([pineconeId])

      if (!vectorResponse.records[pineconeId]) {
        throw new Error(`Vector with ID ${pineconeId} not found in any namespace`)
      }

      isFromSourcesNamespace = true
    }

    const metadata = vectorResponse.records[pineconeId].metadata || {}
    const isSynthesized = metadata?.type === 'synthesized'

    // Add vectorSource to metadata so we can use it for logic later
    metadata.vectorSource = isFromSourcesNamespace ? 'sources' : 'atoms'

    // Get atom data from the CMS based on type
    const payload = await getPayload({ config })
    let atomData: any

    // If it's from the sources namespace, treat as a source
    if (isFromSourcesNamespace) {
      const sourceId = metadata?.payloadId || metadata?.payloadSourceId

      if (!sourceId) throw new Error('Missing source ID for source vector')

      atomData = await payload.findByID({
        collection: 'sources',
        id: sourceId as string,
        depth: 1,
      })

      // Add source flag to help with display
      atomData.isSource = true
    }
    // If it's a synthesized atom
    else if (isSynthesized) {
      const payloadId = metadata?.payloadAtomId
      if (!payloadId) throw new Error('Missing payload ID for synthesized atom')

      atomData = await payload.findByID({
        collection: 'synthesizedAtoms',
        id: payloadId as string,
        depth: 2, // Include parent atoms
      })
    }
    // Regular atom - only search atoms and synthesizedAtoms collections
    else {
      // Try to find by pineconeId in atom collections only
      let found = false

      // Helper function to search in a collection
      const searchInCollection = async (collection: 'atoms' | 'synthesizedAtoms') => {
        const response = await payload.find({
          collection,
          where: {
            pineconeId: { equals: pineconeId },
          },
          depth: 2,
        })
        return response.docs && response.docs.length > 0 ? response.docs[0] : null
      }

      // Try collections sequentially - but NEVER sources collection for atoms namespace

      // 1. Try atoms collection first
      atomData = await searchInCollection('atoms')
      if (atomData) {
        found = true
      }

      // 2. If not found, try synthesizedAtoms collection
      if (!found) {
        const synthResult = await searchInCollection('synthesizedAtoms')
        if (synthResult) {
          atomData = synthResult
          atomData.isSynthesized = true
          found = true
        }
      }

      // If not found in either collection, create a basic atomData object
      if (!found) {
        // Since the vector is from the atoms namespace but not found in collections,
        // create a minimal atom representation from the vector metadata
        atomData = {
          id: pineconeId,
          title: typeof metadata?.text === 'string' ? metadata.text.substring(0, 50) : 'Atom',
          mainContent: typeof metadata?.text === 'string' ? metadata.text : 'No content available',
          pineconeId: pineconeId,
        }
        console.warn(`Created temporary atom data for ${pineconeId} - not found in collections`)
      }
    }

    return {
      ...atomData,
      metadata,
      isSynthesized,
      // Ensure vectorSource is correctly set
      vectorSource: metadata.vectorSource,
    } as AtomData
  } catch (error) {
    console.error('Error fetching atom by ID:', error)
    return null
  }
}
