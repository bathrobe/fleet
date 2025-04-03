'use client'

import { useState, useRef, useEffect } from 'react'
import { ConceptVectorSpace } from '../components/ConceptGraph/ConceptVectorSpace'
import { DetailedAtomCard } from '../components/AtomDisplay/DetailedAtomCard'
import { SynthesizedAtomDisplay } from '../components/AtomDisplay/SynthesizedAtomDisplay'
import { useVectorDataLoader } from '../components/ConceptGraph/hooks/useVectorDataLoader'
import { fetchAtomById } from '../components/ConceptGraph/fetchVectors'

export default function GraphPage() {
  const { vectorData, reducedData, isLoading, error } = useVectorDataLoader()
  const [selectedVectorId, setSelectedVectorId] = useState<string | null>(null)
  const [atomData, setAtomData] = useState<any | null>(null)
  const [isLoadingAtom, setIsLoadingAtom] = useState<boolean>(false)
  const [atomType, setAtomType] = useState<'regular' | 'synthesized'>('regular')
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const containerRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold">Concept Graph</h1>
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

        {/* Atom details sidebar - only shown when an atom is selected */}
        {selectedVectorId && (
          <div className="w-1/3 h-full overflow-y-auto border-l border-gray-200 dark:border-gray-800">
            {isLoadingAtom ? (
              <div className="p-4">Loading atom details...</div>
            ) : atomData ? (
              atomType === 'synthesized' ? (
                <SynthesizedAtomDisplay
                  atom={atomData}
                  onFocusParentAtom={(atomId, pineconeId) => handleVectorClick(pineconeId)}
                />
              ) : (
                <DetailedAtomCard atom={atomData} />
              )
            ) : (
              <div className="p-4 text-gray-500">
                <p>No atom data available for this node.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
