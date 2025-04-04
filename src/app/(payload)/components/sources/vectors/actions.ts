'use server'

// Import the Pinecone library
import { Pinecone } from '@pinecone-database/pinecone'
import {
  formatAtomForEmbedding,
  formatSynthesizedAtomForEmbedding,
  formatSourceForEmbedding,
} from './atoms'
import { v4 as uuidv4 } from 'uuid'

// Initialize a Pinecone client with your API key
export async function upsertVectors(atom: any) {
  if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY is not set')
  }
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })

  const namespace = pc.index('fleet', process.env.PINECONE_URL).namespace('atoms')
  const pineconeAtomId = uuidv4()
  const record = {
    id: pineconeAtomId,
    values: generateRandomEmbedding(1024), // Mock embedding
    metadata: {
      text: formatAtomForEmbedding(atom),
      payloadAtomId: atom.id,
      payloadSourceId: atom.source.id,
      payloadSourceCategoryId: atom.source.sourceCategory.id,
      type: 'atom',
    },
  }
  await namespace.upsert([record])
  return {
    pineconeAtomId,
    payloadAtomId: atom.id,
    payloadSourceId: atom.source.id,
    payloadSourceCategoryId: atom.source.sourceCategory.id,
  }
}

// Initialize a Pinecone client with your API key for synthesized atoms
export async function upsertSynthesizedAtomVectors(atom: any) {
  if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY is not set')
  }

  try {
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })
    const index = pc.index('fleet', process.env.PINECONE_URL)
    // Use the same namespace as regular atoms to avoid separate namespaces
    const namespace = index.namespace('atoms')

    // Generate a unique ID for the vector or use the existing one
    const pineconeAtomId = atom.pineconeId || `synth-${atom.id}`

    // Format the atom text for embedding
    const formattedText = formatSynthesizedAtomForEmbedding(atom)

    // Create metadata object with correct types
    const metadata: Record<string, string | number | string[]> = {
      type: 'synthesizedAtom',
      payloadAtomId: atom.id,
      title: atom.title || 'Synthesized Atom',
      text: formattedText,
    }

    // Get parent atoms data if available
    if (atom.parentAtoms && Array.isArray(atom.parentAtoms)) {
      const parentIds = atom.parentAtoms
        .map((parent: any) => {
          if (typeof parent === 'object' && parent && parent.id) {
            return String(parent.id)
          } else if (typeof parent === 'string' || typeof parent === 'number') {
            return String(parent)
          }
          return null
        })
        .filter(Boolean) as string[]

      if (parentIds.length > 0) {
        metadata.parentAtomIds = parentIds
      }
    }

    // Create record for Pinecone with mock embedding
    // In production, you would generate a real embedding using an API
    const embeddingDimension = 1024
    const record = {
      id: pineconeAtomId,
      values: generateRandomEmbedding(embeddingDimension),
      metadata,
    }

    // Upsert record to Pinecone
    await namespace.upsert([record])

    console.log(
      `Successfully added vector for synthesized atom ${atom.id} with pineconeId: ${pineconeAtomId} to 'atoms' namespace`,
    )

    return {
      pineconeAtomId,
      payloadAtomId: atom.id,
    }
  } catch (error) {
    console.error('Error upserting synthesized atom vector:', error)
    throw error
  }
}

/**
 * Create and upsert vector embeddings for source documents
 * Uses the same namespace as atoms and synthesized atoms but with a 'source' type
 */
export async function upsertSourceVectors(source: any) {
  if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY is not set')
  }

  try {
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })
    const index = pc.index('fleet', process.env.PINECONE_URL)
    // Use the same namespace as atoms to keep everything in one place
    const namespace = index.namespace('atoms')

    // Generate a unique ID for the vector or use the existing one
    const pineconeSourceId = source.pineconeId || `source-${source.id}`

    // Format the source text for embedding
    const formattedText = formatSourceForEmbedding(source)

    // Create metadata object with correct types
    const metadata: Record<string, string | number | string[]> = {
      type: 'source',
      payloadSourceId: source.id,
      title: source.title || 'Untitled Source',
      text: formattedText,
    }

    // Add source category if available
    if (source.sourceCategory) {
      const categoryId =
        typeof source.sourceCategory === 'object' ? source.sourceCategory.id : source.sourceCategory

      metadata.sourceCategoryId = String(categoryId)
    }

    // Create record for Pinecone with mock embedding
    // In production, you would generate a real embedding using an API
    const embeddingDimension = 1024
    const record = {
      id: pineconeSourceId,
      values: generateRandomEmbedding(embeddingDimension),
      metadata,
    }

    // Upsert record to Pinecone
    await namespace.upsert([record])

    console.log(
      `Successfully added vector for source document ${source.id} with pineconeId: ${pineconeSourceId} to 'atoms' namespace`,
    )

    return {
      pineconeSourceId,
      payloadSourceId: source.id,
    }
  } catch (error) {
    console.error('Error upserting source document vector:', error)
    throw error
  }
}

// Helper function to generate random embeddings for demonstration
function generateRandomEmbedding(dimension: number): number[] {
  return Array.from({ length: dimension }, () => Math.random() * 2 - 1)
}

export async function deleteVectors(atomOrAtoms: any) {
  if (!process.env.PINECONE_API_KEY) {
    throw new Error('Missing PINECONE_API_KEY')
  }

  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  })

  const namespace = pc.index('fleet', process.env.PINECONE_URL).namespace('atoms')

  // Single atom - Pass the ID directly as a string
  await namespace.deleteOne(atomOrAtoms)
}
