'use server'

import { v4 as uuidv4 } from 'uuid'
import {
  formatAtomForEmbedding,
  formatSynthesizedAtomForEmbedding,
  formatSourceForEmbedding,
} from './atoms'
import { upsertRecord, deleteRecord, extractParentAtomIds, extractCategoryId } from './core'

/**
 * Upsert vector for regular atom
 */
export async function upsertVectors(atom: any) {
  try {
    const pineconeAtomId = uuidv4()
    const formattedText = formatAtomForEmbedding(atom)

    // Metadata as flat properties
    const metadata = {
      payloadAtomId: atom.id,
      payloadSourceId: atom.source?.id,
      payloadSourceCategoryId: atom.source?.sourceCategory?.id,
      type: 'atom',
    }

    const result = await upsertRecord(pineconeAtomId, formattedText, metadata)

    console.log(`Successfully added atom ${atom.id} with pineconeId: ${pineconeAtomId}`)

    return {
      pineconeAtomId: result.pineconeId,
      payloadAtomId: atom.id,
      payloadSourceId: atom.source?.id,
      payloadSourceCategoryId: atom.source?.sourceCategory?.id,
    }
  } catch (error) {
    console.error('Error upserting atom vector:', error)
    throw error
  }
}

/**
 * Upsert vector for synthesized atom
 */
export async function upsertSynthesizedAtomVectors(atom: any) {
  try {
    const pineconeAtomId = atom.pineconeId || `synth-${atom.id}`
    const formattedText = formatSynthesizedAtomForEmbedding(atom)

    // Prepare metadata
    const metadata: Record<string, any> = {
      type: 'synthesizedAtom',
      payloadAtomId: atom.id,
      title: atom.title || 'Synthesized Atom',
    }

    // Add parent atom IDs if available
    if (atom.parentAtoms && Array.isArray(atom.parentAtoms)) {
      const parentAtomIds = await extractParentAtomIds(atom.parentAtoms)
      if (parentAtomIds) {
        metadata.parentAtomIds = parentAtomIds
      }
    }

    const result = await upsertRecord(pineconeAtomId, formattedText, metadata)

    console.log(
      `Successfully added synthesized atom ${atom.id} with pineconeId: ${result.pineconeId}`,
    )

    return {
      pineconeAtomId: result.pineconeId,
      payloadAtomId: atom.id,
    }
  } catch (error) {
    console.error('Error upserting synthesized atom vector:', error)
    throw error
  }
}

/**
 * Upsert vector for source
 */
export async function upsertSourceVectors(source: any) {
  try {
    const pineconeSourceId = source.pineconeId || `source-${source.id}`
    const formattedText = formatSourceForEmbedding(source)

    // Prepare metadata
    const metadata: Record<string, any> = {
      type: 'source',
      payloadSourceId: source.id,
      title: source.title || 'Untitled Source',
    }

    // Add source category if available
    if (source.sourceCategory) {
      const categoryId = await extractCategoryId(source.sourceCategory)
      if (categoryId) {
        metadata.sourceCategoryId = categoryId
      }
    }

    const result = await upsertRecord(pineconeSourceId, formattedText, metadata)

    console.log(`Successfully added source ${source.id} with pineconeId: ${result.pineconeId}`)

    return {
      pineconeSourceId: result.pineconeId,
      payloadSourceId: source.id,
    }
  } catch (error) {
    console.error('Error upserting source vector:', error)
    throw error
  }
}

/**
 * Delete vector from Pinecone
 */
export async function deleteVectors(atomOrAtoms: any) {
  try {
    await deleteRecord(atomOrAtoms)
  } catch (error) {
    console.error('Error deleting vector:', error)
    throw error
  }
}
