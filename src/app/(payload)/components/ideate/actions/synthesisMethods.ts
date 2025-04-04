'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

// Define types for synthesis methods
export type SynthesisMethod = {
  id: string
  title: string
  description: string
  methodKey: string
}

/**
 * Check if a synthesis method ID exists in the database
 */
export async function validateSynthesisMethodId(id: string | number): Promise<boolean> {
  try {
    const payload = await getPayload({ config })
    const methodId = typeof id === 'string' ? Number(id) : id
    const method = await payload.findByID({
      collection: 'synthesisMethods',
      id: methodId,
    })
    return !!method
  } catch (error) {
    return false
  }
}

/**
 * Server action to fetch all synthesis methods from the database
 */
export async function getSynthesisMethods(): Promise<SynthesisMethod[]> {
  try {
    const payload = await getPayload({ config })

    const response = await payload.find({
      collection: 'synthesisMethods',
      limit: 100, // Assuming there won't be too many synthesis methods
    })

    // Map the response to our expected format
    return response.docs.map((method) => ({
      id: String(method.id),
      title: method.title as string,
      description: method.description as string,
      methodKey: method.methodKey as string,
    }))
  } catch (error) {
    console.error('Error fetching synthesis methods:', error)
    return [] // Return empty array instead of throwing to prevent UI crashes
  }
}

/**
 * Get a synthesis method by ID
 */
export async function getSynthesisMethodById(id: string): Promise<SynthesisMethod | null> {
  try {
    const payload = await getPayload({ config })

    const method = await payload.findByID({
      collection: 'synthesisMethods',
      id,
    })

    if (!method) return null

    return {
      id: String(method.id),
      title: method.title as string,
      description: method.description as string,
      methodKey: method.methodKey as string,
    }
  } catch (error) {
    console.error(`Error fetching synthesis method with ID ${id}:`, error)
    return null
  }
}
