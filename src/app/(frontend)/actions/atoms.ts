'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { Pinecone } from '@pinecone-database/pinecone'
import { cosineSimilarity, findMostDissimilarVectors } from '@/app/(frontend)/lib/atoms'

/**
 * Server action to fetch atoms with pagination
 */
export async function getAtoms(limit = 50, page = 1) {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'atoms',
      limit,
      page,
      sort: '-updatedAt',
      depth: 1,
    })

    return result
  } catch (error) {
    console.error('Error fetching atoms:', error)
    throw new Error('Failed to fetch atoms')
  }
}

// NOTE: The getRandomAtomPair function has been moved to
// the payload components ideate actions. Import from there if needed.

export async function fetchSynthesizedAtom(id: string) {
  try {
    const payload = await getPayload({ config })

    const result = await payload.findByID({
      collection: 'synthesizedAtoms',
      id,
      depth: 2, // To include parent atoms
    })

    return result
  } catch (error) {
    console.error('Error fetching synthesized atom:', error)
    throw new Error('Failed to fetch synthesized atom')
  }
}

/**
 * Server action to fetch synthesized atoms with pagination
 */
export async function getSynthesizedAtoms(limit = 50, page = 1) {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'synthesizedAtoms',
      limit,
      page,
      sort: '-updatedAt',
      depth: 1,
    })

    return result
  } catch (error) {
    console.error('Error fetching synthesized atoms:', error)
    throw new Error('Failed to fetch synthesized atoms')
  }
}

/**
 * Server action to fetch a specific atom by ID
 */
export async function fetchAtom(id: string) {
  try {
    const payload = await getPayload({ config })

    const result = await payload.findByID({
      collection: 'atoms',
      id,
      depth: 2, // Include source and related data
    })

    return result
  } catch (error) {
    console.error('Error fetching atom:', error)
    throw new Error('Failed to fetch atom')
  }
}

/**
 * Server action to fetch sources with pagination
 */
export async function getSources(limit = 50, page = 1) {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'sources',
      limit,
      page,
      sort: 'title',
      depth: 1,
    })

    return result
  } catch (error) {
    console.error('Error fetching sources:', error)
    throw new Error('Failed to fetch sources')
  }
}

/**
 * Server action to fetch a specific source by ID
 */
export async function fetchSource(id: string) {
  try {
    const payload = await getPayload({ config })

    const result = await payload.findByID({
      collection: 'sources',
      id,
      depth: 2, // Include related atoms data
    })

    return result
  } catch (error) {
    console.error('Error fetching source:', error)
    throw new Error('Failed to fetch source')
  }
}

/**
 * Finds other atoms that come from the same source as the given atom
 */
export async function getSiblingAtoms(atomId: string, sourceId: number | string) {
  try {
    const payload = await getPayload({ config })

    // Find other atoms from the same source, excluding the current atom
    const result = await payload.find({
      collection: 'atoms',
      where: {
        and: [{ source: { equals: sourceId } }, { id: { not_equals: atomId } }],
      },
      limit: 5, // Limit to 5 siblings
      depth: 0,
    })

    return result
  } catch (error) {
    console.error('Error fetching sibling atoms:', error)
    throw new Error('Failed to fetch sibling atoms')
  }
}

/**
 * Uses Pinecone to find similar vectors (atoms, synthesized atoms, or sources)
 */
export async function getSimilarVectors(
  pineconeId: string,
  collection: 'atoms' | 'synthesizedAtoms' | 'sources',
) {
  try {
    // Initialize Pinecone client
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' })

    try {
      const index = pc.index('fleet')

      // Always use the 'atoms' namespace but filter by type
      const namespace = index.namespace('atoms')

      // Get the vector from Pinecone
      try {
        const vectorResponse = await namespace.fetch([pineconeId])
        const vector = vectorResponse.records[pineconeId]

        if (!vector || !vector.values) {
          throw new Error(`Vector not found for ID: ${pineconeId}`)
        }

        // Query for similar vectors - get more than we need to allow for filtering
        const queryResponse = await namespace.query({
          vector: vector.values,
          topK: 10, // Get more than we need to allow for filtering
          includeMetadata: true,
          filter:
            collection === 'synthesizedAtoms'
              ? { type: { $eq: 'synthesizedAtom' } }
              : collection === 'atoms'
                ? { type: { $eq: 'atom' } }
                : collection === 'sources'
                  ? { type: { $eq: 'source' } }
                  : undefined,
        })

        // Filter out the original vector
        const similarIds = queryResponse.matches
          .filter((match) => match.id !== pineconeId)
          .map((match) => match.id)

        if (similarIds.length === 0) {
          return { docs: [] }
        }

        // Fetch the actual documents from Payload
        const payload = await getPayload({ config })

        // Determine the correct collection to query in Payload
        const payloadCollection =
          collection === 'atoms'
            ? 'atoms'
            : collection === 'synthesizedAtoms'
              ? 'synthesizedAtoms'
              : 'sources'

        const result = await payload.find({
          collection: payloadCollection,
          where: {
            pineconeId: { in: similarIds },
          },
          depth: 1,
        })

        return result
      } catch (fetchError) {
        return { docs: [] }
      }
    } catch (indexError) {
      return { docs: [] }
    }
  } catch (error) {
    return { docs: [] } // Return empty array on error
  }
}
