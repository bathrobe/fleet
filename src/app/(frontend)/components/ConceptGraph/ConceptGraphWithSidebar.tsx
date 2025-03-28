'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Sidebar, SidebarContent, SidebarProvider } from '@/app/ui/sidebar'
import { AtomSidebar } from '../AtomSidebar/AtomSidebar'
import { ConceptVectorSpace } from './ConceptVectorSpace'
import { DetailedAtomCard } from '../AtomDisplay/DetailedAtomCard'
import { SynthesizedAtomDisplay } from '../AtomDisplay/SynthesizedAtomDisplay'
import { SynthesizedAtomDisplayMobile } from '../AtomDisplay/SynthesizedAtomDisplayMobile'
import { fetchAtom, fetchSynthesizedAtom } from '@/app/(frontend)/actions/atoms'
import { fetchAtomById } from '@/app/(frontend)/components/ConceptGraph/fetchVectors'

type ConceptGraphWithSidebarProps = {
  vectorData: any
  reducedData: any
  initialAtomId?: string
  initialPineconeId?: string
  initialCollection?: string
}

export function ConceptGraphWithSidebar({
  vectorData,
  reducedData,
  initialAtomId,
  initialPineconeId,
  initialCollection,
}: ConceptGraphWithSidebarProps) {
  // Store both the atom's database ID and its pineconeId (vector ID)
  const [selectedAtomId, setSelectedAtomId] = useState<string | null>(initialAtomId || null)
  const [selectedVectorId, setSelectedVectorId] = useState<string | null>(initialPineconeId || null)
  const [atomData, setAtomData] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [atomType, setAtomType] = useState<'regular' | 'synthesized'>('regular')
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const containerRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Direct atom loading function that handles both collections
  const loadAtom = async (atomId: string, pineconeId: string, collection: string) => {
    try {
      setIsLoading(true)
      setSelectedAtomId(atomId)

      // Also set the vector ID to highlight the node in the scatter plot
      if (pineconeId) {
        setSelectedVectorId(pineconeId)
        console.log('Setting selected vector ID:', pineconeId)
      }

      console.log(`Loading ${collection} atom with ID:`, atomId)

      if (collection === 'synthesizedAtoms') {
        setAtomType('synthesized')
        const atom = await fetchSynthesizedAtom(atomId)
        setAtomData(atom)
      } else {
        setAtomType('regular')
        const atom = await fetchAtom(atomId)
        setAtomData(atom)
      }
    } catch (error) {
      console.error(`Failed to load ${collection} atom:`, error)
      setAtomData(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle click from vector space - this is still using pineconeId
  const handleVectorClick = async (vectorId: string) => {
    console.log('Vector clicked:', vectorId)
    // This should continue using the existing vector-based lookup
    try {
      setIsLoading(true)
      setSelectedVectorId(vectorId) // Update the selected vector ID

      // Keep using fetchAtomById which uses Pinecone to determine the type
      const data = await fetchAtomById(vectorId)

      if (data) {
        setAtomData(data)
        setSelectedAtomId(String(data.id))

        // Check metadata type for atom type determination
        const isSynthesized =
          data.isSynthesized || (data.metadata && data.metadata.type === 'synthesized')
        setAtomType(isSynthesized ? 'synthesized' : 'regular')
      } else {
        console.warn('No atom data found for vector ID:', vectorId)
        setAtomData(null)
      }
    } catch (error) {
      console.error('Error loading atom from vector:', error)
      setAtomData(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Measure container size for the graph
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        console.log('Container dimensions:', width, height)
        setDimensions({ width, height })
      }
    }

    // Set initial dimensions after a short delay to ensure layout is complete
    const timer = setTimeout(updateDimensions, 100)

    // Update dimensions on resize
    window.addEventListener('resize', updateDimensions)

    // Force an additional update after 500ms (helps with layout timing issues)
    const delayedUpdate = setTimeout(updateDimensions, 500)

    return () => {
      window.removeEventListener('resize', updateDimensions)
      clearTimeout(timer)
      clearTimeout(delayedUpdate)
    }
  }, [])

  // Load initial atom from props if provided
  useEffect(() => {
    if (initialAtomId && initialPineconeId) {
      loadAtom(initialAtomId, initialPineconeId, initialCollection || 'atoms')
    }
  }, [initialAtomId, initialPineconeId, initialCollection])

  // Handle URL parameters only if no initial props were provided
  useEffect(() => {
    if (!initialAtomId && !initialPineconeId) {
      const atomId = searchParams.get('atomId')
      const pineconeId = searchParams.get('pineconeId')
      const collection = searchParams.get('collection') || 'atoms'

      if (atomId && pineconeId) {
        loadAtom(atomId, pineconeId, collection)
      }
    }
  }, [searchParams, initialAtomId, initialPineconeId])

  // Mobile layout with top/bottom sections
  if (isMobile) {
    return (
      <div className="flex flex-col h-screen w-full">
        {/* Graph on top */}
        <div className="h-1/2" ref={containerRef}>
          <ConceptVectorSpace
            width={dimensions.width}
            height={dimensions.height}
            reducedData={reducedData}
            selectedNodeId={selectedVectorId}
            onNodeClick={handleVectorClick}
          />
        </div>

        {/* Atom details below */}
        <div className="h-1/2 overflow-y-auto border-t">
          {isLoading ? (
            <div className="p-4">Loading atom details...</div>
          ) : atomData ? (
            atomType === 'synthesized' ? (
              <SynthesizedAtomDisplayMobile atom={atomData} onFocusParentAtom={loadAtom} />
            ) : (
              <DetailedAtomCard atom={atomData} />
            )
          ) : (
            <div className="p-4 text-gray-500">
              <h3 className="font-medium text-lg mb-2">Atom Details</h3>
              <p>Select an atom from the graph to view its details</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Desktop layout with sidebars
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AtomSidebar onAtomClick={loadAtom} selectedAtomId={selectedAtomId} />
        <div className="flex-1 h-screen flex items-center justify-center" ref={containerRef}>
          <ConceptVectorSpace
            width={dimensions.width}
            height={dimensions.height}
            reducedData={reducedData}
            selectedNodeId={selectedVectorId} // Use the vector ID for node highlighting
            onNodeClick={handleVectorClick}
          />
        </div>
        <Sidebar className="border-l h-screen" side="right" width="65ch">
          <SidebarContent className="h-full overflow-y-auto">
            {isLoading ? (
              <div className="p-4">Loading atom details...</div>
            ) : atomData ? (
              atomType === 'synthesized' ? (
                <SynthesizedAtomDisplay
                  atom={atomData}
                  onFocusParentAtom={loadAtom}
                  className="border-radius-0"
                />
              ) : (
                <DetailedAtomCard atom={atomData} className="border-radius-0" />
              )
            ) : (
              <div className="p-4 text-gray-500">
                <h3 className="font-medium text-lg mb-2">Atom Details</h3>
                <p>Select an atom from the graph to view its details</p>
                <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800/50">
                  <h4 className="font-medium mb-2">Navigation Tips</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Click on any node in the graph to view its details</li>
                    <li>Regular atoms appear in blue</li>
                    <li>Synthesized atoms appear in green</li>
                    <li>Zoom with the mouse wheel</li>
                    <li>Pan by dragging the background</li>
                  </ul>
                </div>
              </div>
            )}
          </SidebarContent>
        </Sidebar>
      </div>
    </SidebarProvider>
  )
}
