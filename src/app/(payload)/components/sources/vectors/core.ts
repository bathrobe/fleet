'use server'

import { Pinecone } from '@pinecone-database/pinecone'
import { INDEX_NAME, NAMESPACE, INDEX_HOST } from './constants'

/**
 * Initialize and get Pinecone client
 */
export async function getPineconeClient() {
  if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY is not set')
  }
  return new Pinecone({ apiKey: process.env.PINECONE_API_KEY })
}

/**
 * Get Pinecone namespace
 */
export async function getNamespace() {
  const pc = await getPineconeClient()
  return pc.index(INDEX_NAME, INDEX_HOST).namespace(NAMESPACE)
}

/**
 * Generic function to upsert a record with integrated embedding
 */
export async function upsertRecord(id: string, textContent: string, metadata: Record<string, any>) {
  try {
    const namespace = await getNamespace()

    // Create record in format expected by Pinecone integrated embedding
    const record: any = {
      _id: id,
      text: textContent,
      ...metadata,
    }

    // Use upsertRecords for integrated embedding
    await namespace.upsertRecords([record])

    return {
      pineconeId: id,
      success: true,
    }
  } catch (error) {
    console.error('Error upserting record to Pinecone:', error)
    throw error
  }
}

/**
 * Delete a vector from Pinecone
 */
export async function deleteRecord(id: string) {
  try {
    const namespace = await getNamespace()
    await namespace.deleteOne(id)
    return {
      success: true,
      deletedId: id,
    }
  } catch (error) {
    console.error('Error deleting vector:', error)
    throw error
  }
}

/**
 * Extract parent atom IDs from array of parent atom objects/IDs
 */
export async function extractParentAtomIds(parentAtoms: any[]): Promise<string> {
  if (!parentAtoms || !Array.isArray(parentAtoms)) return ''

  const parentIds = parentAtoms
    .map((parent: any) => {
      if (typeof parent === 'object' && parent && parent.id) {
        return String(parent.id)
      } else if (typeof parent === 'string' || typeof parent === 'number') {
        return String(parent)
      }
      return null
    })
    .filter(Boolean) as string[]

  return parentIds.join(',')
}

/**
 * Extract category ID from source category
 */
export async function extractCategoryId(sourceCategory: any): Promise<string | null> {
  if (!sourceCategory) return null

  const categoryId = typeof sourceCategory === 'object' ? sourceCategory.id : sourceCategory

  return categoryId ? String(categoryId) : null
}
