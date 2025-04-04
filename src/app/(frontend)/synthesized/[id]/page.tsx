import { fetchSynthesizedAtom, getSimilarVectors } from '@/app/(frontend)/actions/atoms'
import { SynthesizedAtomDetail } from '../../components/synthesized/SynthesizedAtomDetail'
import { SynthesizedAtomRelatedSidebar } from '../../components/common/RelatedItemsSidebar'
import { notFound } from 'next/navigation'
import { Atom, SynthesizedAtom } from '@/payload-types'
import { Pinecone } from '@pinecone-database/pinecone'
import { cn } from '../../lib/utils'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

// Define a type for our similar items
type SimilarItem = (Atom | SynthesizedAtom) & {
  itemType: 'atom' | 'synthesizedAtom'
}

export default async function SynthesizedAtomDetailPage({ params }: { params: { id: string } }) {
  try {
    const { id } = await params
    console.log(`Loading synthesized atom with ID: ${id}`)

    const atom = await fetchSynthesizedAtom(id)

    if (!atom) {
      notFound()
    }

    console.log(
      `Successfully fetched synthesized atom: ${atom.id}, pineconeId: ${atom.pineconeId || 'none'}`,
    )

    // Track similar items
    let similarItems: SimilarItem[] = []

    if (atom.pineconeId) {
      console.log(`Processing synthesized atom: ${atom.id} with pineconeId: ${atom.pineconeId}`)

      try {
        // Find similar synthesized atoms
        const synthResult = await getSimilarVectors(atom.pineconeId, 'synthesizedAtoms')

        if (synthResult.docs && synthResult.docs.length > 0) {
          console.log(`Found ${synthResult.docs.length} similar synthesized atoms`)

          // Map items with type
          const synthItems = synthResult.docs.map((item) => ({
            ...item,
            itemType: 'synthesizedAtom',
          })) as SimilarItem[]

          similarItems = [...similarItems, ...synthItems]
        } else {
          console.log('No similar synthesized atoms found')
        }
      } catch (err) {
        const error = err as Error
        console.log(`Error finding similar synthesized atoms: ${error.message}`)

        // If Pinecone is having issues, let's check directly what index/namespace exists
        try {
          const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' })
          const index = pc.index('fleet')
          const stats = await index.describeIndexStats()
          console.log(`Available namespaces:`, Object.keys(stats.namespaces || {}))

          if (stats.namespaces && stats.namespaces.atoms) {
            console.log(`atoms namespace exists with ${stats.namespaces.atoms.recordCount} records`)

            // Try to find our vector directly to debug
            try {
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
          } else {
            console.log('No atoms namespace found')
          }
        } catch (statsErr) {
          console.error('Error checking Pinecone stats:', statsErr)
        }
      }

      // If we don't have enough items, also try atoms collection
      if (similarItems.length < 3) {
        try {
          const atomResult = await getSimilarVectors(atom.pineconeId, 'atoms')

          if (atomResult.docs && atomResult.docs.length > 0) {
            console.log(`Found ${atomResult.docs.length} similar atoms`)

            // Map items with type
            const atomItems = atomResult.docs.map((item) => ({
              ...item,
              itemType: 'atom',
            })) as SimilarItem[]

            similarItems = [...similarItems, ...atomItems]
          } else {
            console.log('No similar atoms found')
          }
        } catch (err) {
          const error = err as Error
          console.log(`Error finding similar atoms: ${error.message}`)
        }
      }

      // Limit to 3 items
      similarItems = similarItems.slice(0, 3)
      console.log(`Final similar items count: ${similarItems.length}`)
    } else {
      console.log('No pineconeId found for this synthesized atom')
    }

    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto">
            <SynthesizedAtomDetail atom={atom} />
          </div>
          <SynthesizedAtomRelatedSidebar synthesizedAtom={atom} similarItems={similarItems} />
        </div>
      </div>
    )
  } catch (error) {
    console.error(`Error loading synthesized atom ${params.id}:`, error)
    throw new Error('Failed to load synthesized atom')
  }
}
