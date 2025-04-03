import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getReducedGraphData } from '@/utilities/graphData'
import { SyntheticAtomItem } from '../types'

// Fetch synthetic atoms from the database
export const fetchSyntheticAtomsList = async (): Promise<SyntheticAtomItem[]> => {
  const payload = await getPayload({ config: configPromise })
  let syntheticAtoms: SyntheticAtomItem[] = []

  try {
    // Fetch Synthetic Atoms (ID and Title only)
    const syntheticAtomsData = await payload.find({
      collection: 'synthesizedAtoms',
      pagination: false,
      limit: 1000,
      depth: 0,
      sort: 'title',
      // @ts-ignore - Select type issue
      select: ['id', 'title', 'mainContent'],
    })

    // Format the synthetic atoms with consistent title fallbacks
    syntheticAtoms = syntheticAtomsData.docs.map((atom) => ({
      id: String(atom.id), // Ensure ID is a string
      title:
        atom.title ||
        (atom.mainContent
          ? atom.mainContent.substring(0, 50) + '...'
          : `Synthetic Atom ${atom.id}`),
      mainContent: atom.mainContent,
    }))
  } catch (error) {
    console.error('Error fetching synthetic atoms:', error)
  }

  return syntheticAtoms
}

// Add sample synthetic atoms if needed from graph data
export const addSampleSyntheticAtomsIfNeeded = async (
  syntheticAtoms: SyntheticAtomItem[],
): Promise<SyntheticAtomItem[]> => {
  if (syntheticAtoms.length < 5) {
    try {
      // Get sample synthetic atoms from graph data
      const graphData = await getReducedGraphData()
      const sampleSyntheticAtoms = graphData
        .filter((node) => node.metadata?.type === 'synthesized')
        .map((node) => ({
          id: node.id,
          title: node.metadata?.title || `Synthetic Atom ${node.id}`,
        }))

      // Avoid duplicates by checking IDs
      const existingIds = new Set(syntheticAtoms.map((atom) => atom.id.toString()))
      const filteredSampleAtoms = sampleSyntheticAtoms.filter(
        (atom) => !existingIds.has(atom.id.toString()),
      )

      return [...syntheticAtoms, ...filteredSampleAtoms]
    } catch (error) {
      console.error('Error loading sample synthetic atoms:', error)
      return syntheticAtoms
    }
  }

  return syntheticAtoms
}

// Sort synthetic atoms by title
export const sortSyntheticAtomsByTitle = (
  syntheticAtoms: SyntheticAtomItem[],
): SyntheticAtomItem[] => {
  return [...syntheticAtoms].sort((a, b) => {
    const titleA = a.title?.toLowerCase() || ''
    const titleB = b.title?.toLowerCase() || ''
    return titleA.localeCompare(titleB)
  })
}

// Get a complete list of synthetic atoms, including samples if needed
export const getSyntheticAtomsList = async (): Promise<SyntheticAtomItem[]> => {
  const syntheticAtoms = await fetchSyntheticAtomsList()
  const withSamples = await addSampleSyntheticAtomsIfNeeded(syntheticAtoms)
  return sortSyntheticAtomsByTitle(withSamples)
}
