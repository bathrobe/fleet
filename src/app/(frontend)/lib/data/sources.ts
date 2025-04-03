import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { SourceItem } from '../types'

// Sample sources
const sampleSources = [
  { id: '201', title: 'Capitalism, Socialism and Democracy - Joseph Schumpeter' },
  { id: '202', title: 'The Sovereign Individual - James Dale Davidson' },
  { id: '203', title: 'The Planetary Computer - Benjamin Bratton' },
  { id: '204', title: 'Seeing Like a State - James C. Scott' },
  { id: '205', title: 'Cities and the Wealth of Nations - Jane Jacobs' },
  {
    id: '206',
    title: 'Postmodernism, or the Cultural Logic of Late Capitalism - Fredric Jameson',
  },
  { id: '207', title: 'The Stack: On Software and Sovereignty - Benjamin Bratton' },
  { id: '208', title: 'Complexity Economics - W. Brian Arthur' },
  { id: '209', title: 'The Gardens of Democracy - Eric Liu & Nick Hanauer' },
  { id: '210', title: 'The Power of Pull - John Hagel III' },
  { id: '211', title: 'New Dark Age - James Bridle' },
  { id: '212', title: 'Radical Markets - Eric A. Posner & E. Glen Weyl' },
]

// Fetch sources from the database
export const fetchSourcesList = async (): Promise<SourceItem[]> => {
  const payload = await getPayload({ config: configPromise })
  let sources: SourceItem[] = []

  try {
    // Fetch Sources (ID and Title only)
    const sourcesData = await payload.find({
      collection: 'sources',
      pagination: false,
      limit: 1000,
      depth: 0,
      sort: 'title',
      // @ts-ignore - Select type issue
      select: ['id', 'title', 'url', 'author'],
    })

    // Ensure docs exist and map them
    if (sourcesData.docs) {
      sources = sourcesData.docs.map((source) => ({
        id: String(source.id),
        title:
          source.title || // Actual title first
          (source.author ? `${source.author}'s Work` : null) || // Fallback to author
          (source.url ? `Source: ${source.url.substring(0, 40)}...` : null) || // Fallback to URL
          `Source ${source.id}`, // Final fallback
        url: source.url,
        author: source.author,
      }))
    }
  } catch (error) {
    console.error('Error fetching sources:', error)
  }

  return sources
}

// Add sample sources if needed
export const addSampleSourcesIfNeeded = (sources: SourceItem[]): SourceItem[] => {
  if (sources.length < 5) {
    // Avoid duplicates by checking IDs
    const existingIds = new Set(sources.map((source) => source.id.toString()))
    const filteredSampleSources = sampleSources.filter(
      (source) => !existingIds.has(source.id.toString()),
    )

    return [...sources, ...filteredSampleSources]
  }

  return sources
}

// Sort sources by title
export const sortSourcesByTitle = (sources: SourceItem[]): SourceItem[] => {
  return [...sources].sort((a, b) => {
    const titleA = a.title?.toLowerCase() || ''
    const titleB = b.title?.toLowerCase() || ''
    return titleA.localeCompare(titleB)
  })
}

// Get a complete list of sources, including samples if needed
export const getSourcesList = async (): Promise<SourceItem[]> => {
  const sources = await fetchSourcesList()
  const withSamples = addSampleSourcesIfNeeded(sources)
  return sortSourcesByTitle(withSamples)
}
