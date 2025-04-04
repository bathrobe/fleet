'use client'

import { useState, useRef, useEffect } from 'react'
import { ConceptVectorSpace } from '../components/ConceptGraph/ConceptVectorSpace'
import { DetailedAtomCard } from '../components/AtomDisplay/DetailedAtomCard'
import { SynthesizedAtomDisplay } from '../components/AtomDisplay/SynthesizedAtomDisplay'
import { useVectorDataLoader } from '../components/ConceptGraph/hooks/useVectorDataLoader'
import { fetchAtomById } from '../components/ConceptGraph/fetchVectors'
import Link from 'next/link'
import { Button } from '@/app/ui/button'
import { ExternalLink } from 'lucide-react'

export default function GraphPage() {
  const { vectorData, reducedData, isLoading, error } = useVectorDataLoader()
  const [selectedVectorId, setSelectedVectorId] = useState<string | null>(null)
  const [atomData, setAtomData] = useState<any | null>(null)
  const [isLoadingAtom, setIsLoadingAtom] = useState<boolean>(false)
  const [atomType, setAtomType] = useState<'regular' | 'synthesized'>('regular')
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Get summary stats for overview card
  const stats = {
    totalNodes: vectorData.length,
    // Regular atoms come from atoms namespace but are not synthesized
    atomsCount: vectorData.filter(
      (v) => v.metadata?.vectorSource === 'atoms' && v.metadata?.type !== 'synthesized',
    ).length,
    // Synthesized atoms are explicitly marked
    synthesizedCount: vectorData.filter((v) => v.metadata?.type === 'synthesized').length,
    // Sources come from the sources namespace
    sourcesCount: vectorData.filter((v) => v.metadata?.vectorSource === 'sources').length,
  }

  // Log to help debug the issue
  console.log('Vector data stats:', {
    total: vectorData.length,
    metadata: vectorData.slice(0, 5).map((v) => v.metadata),
    atoms: stats.atomsCount,
    synthesized: stats.synthesizedCount,
    sources: stats.sourcesCount,
  })

  // Handle graph container resizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    return () => {
      window.removeEventListener('resize', updateDimensions)
    }
  }, [])

  // Handle atom selection
  const handleVectorClick = async (vectorId: string) => {
    if (selectedVectorId === vectorId) {
      // Deselect if clicking the same atom
      setSelectedVectorId(null)
      setAtomData(null)
      return
    }

    try {
      setIsLoadingAtom(true)
      setSelectedVectorId(vectorId)

      const data = await fetchAtomById(vectorId)

      if (data) {
        setAtomData(data)
        const isSynthesized =
          data.isSynthesized || (data.metadata && data.metadata.type === 'synthesized')
        setAtomType(isSynthesized ? 'synthesized' : 'regular')
      } else {
        setAtomData(null)
      }
    } catch (error) {
      console.error('Error loading atom:', error)
      setAtomData(null)
    } finally {
      setIsLoadingAtom(false)
    }
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  if (isLoading) {
    return <div className="p-4">Loading concept graph...</div>
  }

  // Function to get the appropriate link based on atom type and data
  const getAtomLink = () => {
    if (!atomData) return null

    if (atomData.isSource && atomData.metadata?.payloadSourceId) {
      return `/sources/${atomData.metadata.payloadSourceId}`
    } else if (atomType === 'synthesized' && atomData.id) {
      return `/synthesized/${atomData.id}`
    } else if (atomData.id) {
      return `/atoms/${atomData.id}`
    }

    return null
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold">Concept Graph</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Visual representation of the knowledge space
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main graph area */}
        <div ref={containerRef} className="flex-1 h-full">
          <ConceptVectorSpace
            width={dimensions.width}
            height={dimensions.height}
            reducedData={reducedData}
            selectedNodeId={selectedVectorId}
            onNodeClick={handleVectorClick}
          />
        </div>

        {/* Sidebar - always shown, either with stats or atom details */}
        <div className="w-1/3 h-full overflow-y-auto border-l border-gray-200 dark:border-gray-800">
          {isLoadingAtom ? (
            <div className="p-4">Loading atom details...</div>
          ) : atomData ? (
            <>
              {/* Link to full view */}
              {getAtomLink() && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800/30 flex justify-between items-center">
                  <span className="text-sm font-medium">View complete details</span>
                  <Link href={getAtomLink()!}>
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Open</span>
                    </Button>
                  </Link>
                </div>
              )}

              {/* Atom details */}
              {atomType === 'synthesized' ? (
                <SynthesizedAtomDisplay
                  atom={atomData}
                  onFocusParentAtom={(atomId, pineconeId) => handleVectorClick(pineconeId)}
                />
              ) : (
                <DetailedAtomCard atom={atomData} />
              )}
            </>
          ) : (
            // Summary card when no atom is selected
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4">Knowledge Graph Summary</h2>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.atomsCount}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Atomic Concepts
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {stats.synthesizedCount}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Synthesized Ideas
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {stats.sourcesCount}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Source Documents
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                      {stats.totalNodes}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Nodes</div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2 bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg">
                  <p>
                    This graph visualizes the semantic relationships between all knowledge in your
                    database.
                  </p>
                  <p>Click on any node to view its details. The color indicates the type:</p>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>Regular Atoms</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Synthesized Atoms</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span>Sources</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href="/atoms">
                    <Button variant="outline" size="sm">
                      Browse Atoms
                    </Button>
                  </Link>
                  <Link href="/synthesized">
                    <Button variant="outline" size="sm">
                      View Synthesized
                    </Button>
                  </Link>
                  <Link href="/sources">
                    <Button variant="outline" size="sm">
                      Explore Sources
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
