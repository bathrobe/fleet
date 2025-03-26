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
