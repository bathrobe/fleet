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

    // Convert string to number if needed for consistency
    const methodId = typeof id === 'string' ? Number(id) : id

    // Log what we're checking
    console.log(`Validating synthesis method with ID: ${methodId} (type: ${typeof methodId})`)

    // Try to find the method by ID, handle potential errors
    try {
      const method = await payload.findByID({
        collection: 'synthesisMethods',
        id: methodId,
      })

      const exists = !!method
      console.log(`Method exists: ${exists}`, exists ? method.title : '')
      return exists
    } catch (error) {
      console.error(`Error validating synthesis method ID ${methodId}:`, error)
      return false
    }
  } catch (error) {
    console.error('Error connecting to Payload:', error)
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
