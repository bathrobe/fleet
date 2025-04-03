import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getReducedGraphData } from '@/utilities/graphData'
import { AtomItem } from '../types'

// Fetch atoms from the database
export const fetchAtomsList = async (): Promise<AtomItem[]> => {
  const payload = await getPayload({ config: configPromise })
  let atoms: AtomItem[] = []

  try {
    // Fetch Atoms (ID and Title only)
    const atomsData = await payload.find({
      collection: 'atoms',
      pagination: false,
      limit: 1000,
      depth: 0,
      sort: 'title',
      // @ts-ignore - Select type issue
      select: ['id', 'title', 'mainContent'],
    })

    // Format the atoms with consistent title fallbacks
    atoms = atomsData.docs.map((atom) => ({
      id: String(atom.id), // Ensure ID is a string
      title:
        atom.title ||
        (atom.mainContent ? atom.mainContent.substring(0, 50) + '...' : `Atom ${atom.id}`),
      mainContent: atom.mainContent,
    }))
  } catch (error) {
    console.error('Error fetching atoms:', error)
  }

  return atoms
}

// Add sample atoms if needed from graph data
export const addSampleAtomsIfNeeded = async (atoms: AtomItem[]): Promise<AtomItem[]> => {
  if (atoms.length < 5) {
    try {
      // Get sample atoms from graph data
      const graphData = await getReducedGraphData()
      const sampleAtoms = graphData
        .filter((node) => node.metadata?.type === 'regular')
        .map((node) => ({
          id: node.id,
          title: node.metadata?.title || `Atom ${node.id}`,
        }))

      // Avoid duplicates by checking IDs
      const existingIds = new Set(atoms.map((atom) => atom.id.toString()))
      const filteredSampleAtoms = sampleAtoms.filter((atom) => !existingIds.has(atom.id.toString()))

      return [...atoms, ...filteredSampleAtoms]
    } catch (error) {
      console.error('Error loading sample atoms:', error)
      return atoms
    }
  }

  return atoms
}

// Sort atoms by title
export const sortAtomsByTitle = (atoms: AtomItem[]): AtomItem[] => {
  return [...atoms].sort((a, b) => {
    const titleA = a.title?.toLowerCase() || ''
    const titleB = b.title?.toLowerCase() || ''
    return titleA.localeCompare(titleB)
  })
}

// Get a complete list of atoms, including samples if needed
export const getAtomsList = async (): Promise<AtomItem[]> => {
  const atoms = await fetchAtomsList()
  const withSamples = await addSampleAtomsIfNeeded(atoms)
  return sortAtomsByTitle(withSamples)
}
