'use server'

import { SourceItem } from '../types'

interface ApiResponse {
  docs: any[]
  totalDocs: number
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// Mock data for development
const MOCK_SOURCES: SourceItem[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `source-${i + 1}`,
  title: `Source ${i + 1}`,
  author: `Author ${i + 1}`,
  url: `https://example.com/source-${i + 1}`,
  description: `This is a source document ${i + 1} with important content.`,
}))

/**
 * Fetch sources from the API with optional pagination and search query
 */
export async function getSources(
  options: {
    page?: number
    limit?: number
    search?: string
  } = {},
): Promise<{
  items: SourceItem[]
  totalCount: number
  page: number
  totalPages: number
}> {
  const { page = 1, limit = 50, search = '' } = options

  try {
    // For development, just return mock data with filtering if search is provided
    let filteredSources = MOCK_SOURCES

    if (search) {
      const searchLower = search.toLowerCase()
      filteredSources = MOCK_SOURCES.filter(
        (source) =>
          source.title?.toLowerCase().includes(searchLower) ||
          source.author?.toLowerCase().includes(searchLower),
      )
    }

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedSources = filteredSources.slice(startIndex, endIndex)

    return {
      items: paginatedSources,
      totalCount: filteredSources.length,
      page,
      totalPages: Math.ceil(filteredSources.length / limit),
    }

    // In production, call actual API
    // const response = await fetch(url)
    // const data: ApiResponse = await response.json()
    // return {
    //   items: data.docs.map(item => ({
    //     id: item.id,
    //     title: item.title,
    //     author: item.author,
    //     url: item.url,
    //     description: item.oneSentenceSummary || null
    //   })),
    //   totalCount: data.totalDocs,
    //   page: data.page,
    //   totalPages: data.totalPages
    // }
  } catch (error) {
    console.error('Error fetching sources:', error)
    return {
      items: [],
      totalCount: 0,
      page: 1,
      totalPages: 0,
    }
  }
}

/**
 * Fetch a single source by ID
 */
export async function getSourceById(id: string): Promise<SourceItem | null> {
  try {
    // For development, return mock data
    const source = MOCK_SOURCES.find((s) => s.id === id)
    return source || null

    // In production, call actual API
    // const response = await fetch(`api/sources/${id}`)
    // const data = await response.json()
    // return {
    //   id: data.id,
    //   title: data.title,
    //   author: data.author,
    //   url: data.url,
    //   description: data.oneSentenceSummary || null
    // }
  } catch (error) {
    console.error(`Error fetching source ${id}:`, error)
    return null
  }
}
