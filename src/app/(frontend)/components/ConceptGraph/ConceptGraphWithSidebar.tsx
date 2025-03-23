'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { AtomSidebar } from '../AtomSidebar/AtomSidebar'
import { ConceptVectorSpace } from './ConceptVectorSpace'
import { SidebarProvider } from '../ui/sidebar'
import { fetchAtomById } from './fetchVectors'
import type { VectorData, AtomData } from './fetchVectors'
import type { ReducedVectorData } from './dimensionReducer'
import { AtomCard } from '../AtomDisplay/AtomCard'
import { FullWidthLayout } from '../Layout/FullWidthLayout'

type ConceptGraphWithSidebarProps = {
  vectorData: VectorData[]
  reducedData: ReducedVectorData[]
}

export function ConceptGraphWithSidebar({ vectorData, reducedData }: ConceptGraphWithSidebarProps) {
  const [selectedAtomId, setSelectedAtomId] = useState<string | null>(null)
  const [selectedVectorId, setSelectedVectorId] = useState<string | null>(null)
  const [atomData, setAtomData] = useState<AtomData | null>(null)
  const [isLoadingAtom, setIsLoadingAtom] = useState<boolean>(false)
  const graphContainerRef = useRef<HTMLDivElement>(null)
  const [graphDimensions, setGraphDimensions] = useState({ width: 800, height: 600 })

  // Update graph dimensions on resize
  useEffect(() => {
    if (!graphContainerRef.current) return

    const updateDimensions = () => {
      if (graphContainerRef.current) {
        setGraphDimensions({
          width: graphContainerRef.current.clientWidth,
          height: graphContainerRef.current.clientHeight,
        })
      }
    }

    // Set initial dimensions
    updateDimensions()

    // Set up resize observer
    const resizeObserver = new ResizeObserver(updateDimensions)
    resizeObserver.observe(graphContainerRef.current)

    return () => {
      if (graphContainerRef.current) {
        resizeObserver.unobserve(graphContainerRef.current)
      }
    }
  }, [])

  // Function to load atom data by Pinecone ID
  const loadAtomByPineconeId = useCallback(async (pineconeId: string) => {
    if (!pineconeId) return

    try {
      setIsLoadingAtom(true)
      const data = await fetchAtomById(pineconeId)
      setAtomData(data)
      if (data) {
        setSelectedAtomId(data.id)
      }
    } catch (error) {
      console.error('Error loading atom data:', error)
      setAtomData(null)
    } finally {
      setIsLoadingAtom(false)
    }
  }, [])

  // Handle clicking an atom in the sidebar
  const handleAtomClick = useCallback(
    async (atomId: string, pineconeId: string) => {
      setSelectedAtomId(atomId)
      setSelectedVectorId(pineconeId)
      await loadAtomByPineconeId(pineconeId)
    },
    [loadAtomByPineconeId],
  )

  // Handle clicking a node in the graph
  const handleNodeClick = useCallback(
    async (vectorId: string) => {
      setSelectedVectorId(vectorId)
      await loadAtomByPineconeId(vectorId)
    },
    [loadAtomByPineconeId],
  )

  // Calculate the position of the selected vector
  const selectedVectorPosition = selectedVectorId
    ? reducedData.find((d) => d.id === selectedVectorId)?.position
    : undefined

  // Clear selection handler
  const handleClearSelection = useCallback(() => {
    setSelectedAtomId(null)
    setSelectedVectorId(null)
    setAtomData(null)
  }, [])

  // Determine if we should show the right panel
  const showRightPanel = atomData !== null || isLoadingAtom

  // Prepare the content for the graph area
  const graphContent = (
    <div className="h-full w-full" ref={graphContainerRef}>
      <ConceptVectorSpace
        width={graphDimensions.width}
        height={graphDimensions.height}
        reducedData={reducedData}
        selectedNodeId={selectedVectorId}
        onNodeClick={handleNodeClick}
      />
    </div>
  )

  // Prepare the right panel content
  const rightPanelContent = showRightPanel ? (
    <AtomCard
      atom={atomData}
      loading={isLoadingAtom}
      onClose={handleClearSelection}
      vectorId={selectedVectorId || undefined}
      position={selectedVectorPosition}
      className="h-full w-full"
    />
  ) : undefined

  // Prepare sidebar content
  const sidebarContent = (
    <AtomSidebar onAtomClick={handleAtomClick} selectedAtomId={selectedAtomId} />
  )

  return (
    <SidebarProvider defaultOpen={true}>
      <FullWidthLayout
        leftSidebar={sidebarContent}
        mainContent={graphContent}
        rightPanel={rightPanelContent}
      />
    </SidebarProvider>
  )
}
