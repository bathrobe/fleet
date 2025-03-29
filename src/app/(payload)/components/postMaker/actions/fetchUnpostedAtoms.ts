'use server'

import payload from 'payload'
// import { SynthesizedAtom } from '../types'

export async function fetchUnpostedAtoms() {
  try {
    console.log('Attempting to fetch unposted atoms')

    // Debug available collections and APIs
    try {
      const collections = await payload.collections
      console.log('Available collections:', Object.keys(collections))
    } catch (e: any) {
      console.log('Could not access payload.collections:', e.message)
    }

    // Try approach 1: Standard API
    try {
      const response = await payload.find({
        collection: 'synthesizedAtoms',
        where: {
          'posting.isPosted': {
            equals: false,
          },
        },
        limit: 100,
        sort: '-createdAt',
        depth: 1,
      })

      console.log(`Found ${response.docs.length} unposted atoms`)
      return response.docs.map((atom) => ({
        ...atom,
        id: String(atom.id),
      }))
    } catch (e: any) {
      console.log('Standard API approach failed:', e.message)
    }

    // Try approach 2: Different casing of collection name
    try {
      // Using any to bypass TypeScript's strict collection name checking
      const altResponse = await payload.find({
        collection: 'SynthesizedAtoms' as any,
        limit: 100,
      })

      console.log(`Found ${altResponse.docs.length} atoms using alternative casing`)
      return altResponse.docs.map((atom) => ({
        ...atom,
        id: String(atom.id),
      }))
    } catch (e: any) {
      console.log('Alternative casing approach failed:', e.message)
    }

    // Try approach 3: Direct REST API access (workaround)
    try {
      const baseUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'
      const apiResponse = await fetch(
        `${baseUrl}/api/synthesizedAtoms?where[posting.isPosted][equals]=false&limit=100&depth=1`,
      )

      if (apiResponse.ok) {
        const data = await apiResponse.json()
        console.log(`Found ${data.docs.length} atoms using REST API`)
        return data.docs.map((atom: any) => ({
          ...atom,
          id: String(atom.id),
        }))
      } else {
        console.log('REST API request failed with status:', apiResponse.status)
      }
    } catch (e: any) {
      console.log('REST API approach failed:', e.message)
    }

    console.log('All approaches failed, returning mock data')
    // Return mock data as last resort
    return [
      {
        id: '1',
        title: 'Mock Synthesized Atom (API Error)',
        mainContent:
          'This is mock data returned because the API call failed. See server logs for details.',
        supportingInfo: [{ text: 'API Error: Failed to fetch real data' }],
        parentAtoms: [],
        posting: { isPosted: false },
      },
    ]
  } catch (mainError: any) {
    console.error('Unhandled error in fetchUnpostedAtoms:', mainError)
    return [
      {
        id: '1',
        title: 'Error Fetching Data',
        mainContent: 'An unexpected error occurred. Check server logs.',
        supportingInfo: [{ text: `Error: ${mainError.message}` }],
        parentAtoms: [],
        posting: { isPosted: false },
      },
    ]
  }
}
