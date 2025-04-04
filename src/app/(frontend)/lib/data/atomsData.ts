'use server'

import { AtomItem } from '../types'

interface ApiResponse {
  docs: any[]
  totalDocs: number
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// Mock data for development
const MOCK_ATOMS: AtomItem[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `atom-${i + 1}`,
  title: `Atom ${i + 1}`,
  mainContent: `This is a mock atom ${i + 1} with some content to display.`,
  description: `Short description for atom ${i + 1}`,
}))

/**
 * Fetch atoms from the API with optional pagination and search query
 */
export async function getAtoms(
  options: {
    page?: number
    limit?: number
    search?: string
  } = {},
): Promise<{
  items: AtomItem[]
  totalCount: number
  page: number
  totalPages: number
}> {
  const { page = 1, limit = 50, search = '' } = options

  try {
    // For development, just return mock data with filtering if search is provided
    // In production, this would call the actual API
    let filteredAtoms = MOCK_ATOMS

    if (search) {
      const searchLower = search.toLowerCase()
      filteredAtoms = MOCK_ATOMS.filter(
        (atom) =>
          atom.title?.toLowerCase().includes(searchLower) ||
          atom.mainContent?.toLowerCase().includes(searchLower),
      )
    }

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedAtoms = filteredAtoms.slice(startIndex, endIndex)

    return {
      items: paginatedAtoms,
      totalCount: filteredAtoms.length,
      page,
      totalPages: Math.ceil(filteredAtoms.length / limit),
    }

    // In production, call actual API
    // const response = await fetch(url)
    // const data: ApiResponse = await response.json()
    // return {
    //   items: data.docs.map(item => ({
    //     id: item.id,
    //     title: item.title,
    //     mainContent: item.mainContent,
    //     description: item.mainContent?.substring(0, 100) + '...'
    //   })),
    //   totalCount: data.totalDocs,
    //   page: data.page,
    //   totalPages: data.totalPages
    // }
  } catch (error) {
    console.error('Error fetching atoms:', error)
    return {
      items: [],
      totalCount: 0,
      page: 1,
      totalPages: 0,
    }
  }
}

/**
 * Fetch a single atom by ID
 */
export async function getAtomById(id: string): Promise<AtomItem | null> {
  try {
    // For development, return mock data
    const atom = MOCK_ATOMS.find((a) => a.id === id)
    return atom || null

    // In production, call actual API
    // const response = await fetch(`api/atoms/${id}`)
    // const data = await response.json()
    // return {
    //   id: data.id,
    //   title: data.title,
    //   mainContent: data.mainContent,
    //   description: data.mainContent?.substring(0, 100) + '...'
    // }
  } catch (error) {
    console.error(`Error fetching atom ${id}:`, error)
    return null
  }
}
