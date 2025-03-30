'use server'

import type { Payload } from 'payload'
import { SynthesizedAtom } from '../types'
import payloadConfig from '../../../../../payload.config'
// Create a function that accepts payload as a parameter
export async function fetchUnpostedAtomsWithPayload(
  payloadInstance: Payload,
): Promise<SynthesizedAtom[]> {
  try {
    const response = await payloadInstance.find({
      collection: 'synthesizedAtoms',
      where: {
        'posting.isPosted': {
          equals: false,
        },
      },
      limit: 100,
      sort: '-createdAt',
      depth: 2, // Set to 0 since we're using explicit population

      overrideAccess: true,
      showHiddenFields: false,
    })

    return response.docs.map((atom) => ({
      ...atom,
      id: String(atom.id),
    }))
  } catch (error: any) {
    console.error('Error fetching unposted atoms:', error.message)
    throw error // Let the error propagate instead of using fallbacks
  }
}

// Keep the original function but have it use getPayload
export async function fetchUnpostedAtoms(): Promise<any> {
  try {
    // Import dynamically to prevent Next.js build issues
    const { getPayload } = await import('payload')
    // @ts-ignore
    const payloadInstance = await getPayload({ config: payloadConfig })

    return fetchUnpostedAtomsWithPayload(payloadInstance)
  } catch (error: any) {
    console.error('Error initializing payload:', error.message)
    // Fallback error response...
  }
}
