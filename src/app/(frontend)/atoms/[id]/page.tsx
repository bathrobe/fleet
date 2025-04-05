import { fetchAtom, getSiblingAtoms, getSimilarVectors } from '@/app/(frontend)/actions/atoms'
import { AtomDetail } from '../../components/atoms/AtomDetail'
import { AtomRelatedSidebar } from '../../components/common/RelatedItemsSidebar'
import { SimilarItemsSection } from '../../components/common/SimilarItemsSection'
import { notFound } from 'next/navigation'
import { Atom } from '@/payload-types'
import { Pinecone } from '@pinecone-database/pinecone'

export default async function AtomDetailPage({ params }: { params: any }) {
  try {
    const { id } = await params
    console.log(`Loading atom with ID: ${id}`)

    const atom = await fetchAtom(id)

    if (!atom) {
      notFound()
    }

    console.log(`Successfully fetched atom: ${atom.id}, pineconeId: ${atom.pineconeId || 'none'}`)

    // Additional data for the sidebar
    let siblingAtoms: Atom[] = []
    let similarAtoms: Atom[] = []

    // Get other atoms from the same source
    if (atom.source && typeof atom.source !== 'number') {
      const result = await getSiblingAtoms(id, atom.source.id)
      siblingAtoms = result.docs as Atom[]
      console.log(`Found ${siblingAtoms.length} sibling atoms from the same source`)
    }

    // Get similar atoms by vector if this atom has a vector
    if (atom.pineconeId) {
      try {
        const result = await getSimilarVectors(atom.pineconeId, 'atoms')

        // Add debug info to check if vector is found
        console.log(`getSimilarVectors found ${result.docs?.length || 0} results`)

        // Filter out atoms from the same source to avoid redundancy with sidebar
        similarAtoms = (result.docs as Atom[])
          .filter((similarAtom) => {
            if (!similarAtom.source) return true

            const sourceId =
              typeof similarAtom.source === 'number' ? similarAtom.source : similarAtom.source.id

            const currentSourceId = typeof atom.source === 'number' ? atom.source : atom.source?.id

            return sourceId !== currentSourceId
          })
          .slice(0, 3) // Limit to top 3 items after filtering

        console.log(
          `Found ${similarAtoms.length} similar atoms by vector similarity (after filtering)`,
        )
      } catch (err) {
        const error = err as Error
        console.error(`Error finding similar atoms: ${error.message}`)

        // Add debug diagnostics for pinecone
        try {
          const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' })
          const index = pc.index('fleet')
          const vectorData = await index.namespace('atoms').fetch([atom.pineconeId])

          if (vectorData.records[atom.pineconeId]) {
            console.log(`Found vector in 'atoms' namespace with ID: ${atom.pineconeId}`)
            console.log(`Vector metadata:`, vectorData.records[atom.pineconeId].metadata)
          } else {
            console.log(`Vector with ID ${atom.pineconeId} not found in 'atoms' namespace`)
          }
        } catch (fetchErr) {
          console.error('Error fetching vector directly:', fetchErr)
        }
      }
    } else {
      console.log('No pineconeId found on this atom')
    }

    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto">
            <AtomDetail atom={atom} />
          </div>
          <AtomRelatedSidebar atom={atom} siblingAtoms={siblingAtoms} similarAtoms={similarAtoms} />
        </div>
      </div>
    )
  } catch (error) {
    console.error(`Error loading atom ${params.id}:`, error)
    throw new Error('Failed to load atom')
  }
}
