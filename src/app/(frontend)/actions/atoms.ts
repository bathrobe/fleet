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

/**
 * Server action to fetch a pair of random atoms for ideation
 * With optional dissimilarity via vector search
 */
export async function getRandomAtomPair(poolSize = 5) {
  try {
    const payload = await getPayload({ config, importMap: {} })

    // First get the count of atoms
    const { totalDocs } = await payload.find({
      collection: 'atoms',
      limit: 1,
    })

    if (totalDocs === 0) {
      throw new Error('No atoms found in the database')
    }

    // Generate a random index
    const randomIndex = Math.floor(Math.random() * totalDocs)

    // Fetch a single atom at that random position
    const { docs: randomAtoms } = await payload.find({
      collection: 'atoms',
      limit: 1,
      page: randomIndex + 1,
      depth: 2, // Include source data
    })

    if (!randomAtoms || randomAtoms.length === 0) {
      throw new Error('Failed to retrieve random atom')
    }

    const firstAtom = randomAtoms[0]

    // We need to get a dissimilar atom
    // First, check if this atom has a Pinecone vector ID
    if (!firstAtom.pineconeId) {
      // If no vector ID, just return another random atom
      const secondRandomIndex = Math.floor(Math.random() * totalDocs)

      const { docs: secondRandomAtoms } = await payload.find({
        collection: 'atoms',
        limit: 1,
        page:
          secondRandomIndex === randomIndex
            ? ((secondRandomIndex + 1) % totalDocs) + 1
            : secondRandomIndex + 1,
        depth: 2,
      })

      return {
        firstAtom,
        secondAtom: secondRandomAtoms[0] || null,
        method: 'random', // Indicate we selected randomly
      }
    }

    // Now we'll try to find the most dissimilar atom using vector similarity
    try {
      // Initialize Pinecone client
      const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' })
      const index = pc.index('fleet')
      const atomsNamespace = index.namespace('atoms')

      // Fetch the vector for the first atom
      const vectorResponse = await atomsNamespace.fetch([firstAtom.pineconeId])

      // Access vectors using array notation to handle different Pinecone versions
      const firstAtomVector = vectorResponse.records[firstAtom.pineconeId]
      if (!firstAtomVector || !firstAtomVector.values) {
        throw new Error('Vector not found for the first atom')
      }

      const firstVector = firstAtomVector.values

      // Query for all vectors
      const dimension = 1024
      const dummyVector = Array(dimension).fill(0)

      const queryResponse = await atomsNamespace.query({
        vector: dummyVector,
        topK: 100, // Get a reasonable number of atoms
        includeValues: true,
      })

      // Convert to the format needed for findMostDissimilarVectors
      const vectors = queryResponse.matches
        .filter((match) => match.id !== firstAtom.pineconeId && match.values) // Exclude the first atom
        .map((match) => ({
          id: match.id,
          vector: match.values || [],
        }))

      if (vectors.length === 0) {
        throw new Error('No other vectors found to compare')
      }

      // Find the most dissimilar vectors
      const dissimilarIds = findMostDissimilarVectors(firstVector, vectors, poolSize)

      if (dissimilarIds.length === 0) {
        throw new Error('No dissimilar vectors found')
      }

      // Pick a random one from the pool of dissimilar vectors
      const randomDissimilarId = dissimilarIds[Math.floor(Math.random() * dissimilarIds.length)]

      // Fetch the atom data for this ID
      const { docs: dissimilarAtoms } = await payload.find({
        collection: 'atoms',
        where: {
          pineconeId: { equals: randomDissimilarId },
        },
        depth: 2,
      })

      if (!dissimilarAtoms || dissimilarAtoms.length === 0) {
        throw new Error('Failed to fetch dissimilar atom data')
      }

      return {
        firstAtom,
        secondAtom: dissimilarAtoms[0],
        method: 'vector', // Indicate we used vector similarity
      }
    } catch (vectorError) {
      console.error('Error finding dissimilar atom via vectors:', vectorError)

      // Fallback to random selection if vector approach fails
      const secondRandomIndex = Math.floor(Math.random() * totalDocs)

      const { docs: secondRandomAtoms } = await payload.find({
        collection: 'atoms',
        limit: 1,
        page:
          secondRandomIndex === randomIndex
            ? ((secondRandomIndex + 1) % totalDocs) + 1
            : secondRandomIndex + 1,
        depth: 2,
      })

      return {
        firstAtom,
        secondAtom: secondRandomAtoms[0] || null,
        method: 'random-fallback', // Indicate we used random as fallback
      }
    }
  } catch (error) {
    console.error('Error fetching random atom pair:', error)
    throw new Error('An error occurred while fetching atoms')
  }
}

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
    console.log(`Getting similar vectors for ${collection} with pineconeId: ${pineconeId}`)

    // Initialize Pinecone client
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' })

    try {
      const index = pc.index('fleet')

      // List available namespaces
      try {
        const stats = await index.describeIndexStats()
        console.log('Available namespaces:', Object.keys(stats.namespaces || {}))

        // Add more detailed logging about namespaces
        for (const ns in stats.namespaces || {}) {
          if (stats.namespaces) {
            console.log(`Namespace ${ns} has ${stats.namespaces[ns].recordCount} records`)
          }
        }
      } catch (statsError) {
        console.error('Error getting namespaces:', statsError)
      }

      // Always use the 'atoms' namespace but filter by type
      const namespace = index.namespace('atoms')
      console.log(`Using namespace: atoms`)

      // Get the vector from Pinecone
      try {
        const vectorResponse = await namespace.fetch([pineconeId])
        console.log(`Fetch response for ${pineconeId}:`, Object.keys(vectorResponse.records))

        const vector = vectorResponse.records[pineconeId]

        if (!vector || !vector.values) {
          console.error(`Vector not found for ID: ${pineconeId} in namespace 'atoms'`)
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

        console.log(`Found ${queryResponse.matches.length} similar vectors`)

        // Filter out the original vector
        const similarIds = queryResponse.matches
          .filter((match) => match.id !== pineconeId)
          .map((match) => match.id)

        console.log(`After filtering, ${similarIds.length} similar vectors remain`)

        if (similarIds.length === 0) {
          console.log('No similar vectors found after filtering')
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

        console.log(
          `Found ${result.docs.length} documents in ${payloadCollection} with matching pineconeIds`,
        )

        return result
      } catch (fetchError) {
        console.error(`Error fetching vector ${pineconeId} from namespace 'atoms':`, fetchError)
        return { docs: [] }
      }
    } catch (indexError) {
      console.error('Error accessing index:', indexError)
      return { docs: [] }
    }
  } catch (error) {
    console.error(`Error finding similar ${collection}:`, error)
    return { docs: [] } // Return empty array on error
  }
}
