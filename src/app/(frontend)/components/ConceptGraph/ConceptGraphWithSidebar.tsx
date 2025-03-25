'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { AtomSidebar } from '../AtomSidebar/AtomSidebar'
import { ConceptVectorSpace } from './ConceptVectorSpace'
import { SidebarProvider } from '../ui/sidebar'
import type { VectorData } from './fetchVectors'
import type { ReducedVectorData } from './dimensionReducer'
import { DetailedAtomCard } from '../AtomDisplay/DetailedAtomCard'
import { FullWidthLayout } from '../Layout/FullWidthLayout'
import { useAtomLoader } from './hooks/useAtomLoader'

type ConceptGraphWithSidebarProps = {
  vectorData: VectorData[]
  reducedData: ReducedVectorData[]
}

export function ConceptGraphWithSidebar({ vectorData, reducedData }: ConceptGraphWithSidebarProps) {
  const [selectedVectorId, setSelectedVectorId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
  const graphContainerRef = useRef<HTMLDivElement>(null)
  const [graphDimensions, setGraphDimensions] = useState({ width: 800, height: 600 })

  // Use our atom loader hook
  const { selectedAtomId, atomData, isLoading, loadAtomById, clearSelection } = useAtomLoader()

  // Detect mobile viewport
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)

      // Always keep sidebar open regardless of viewport size
      // Only close on mobile
      if (mobile) {
        setSidebarOpen(false)
      } else {
        // Always keep sidebar open on laptop/desktop
        setSidebarOpen(true)
      }
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)

    return () => {
      window.removeEventListener('resize', checkIsMobile)
    }
  }, [])

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

  // Handle clicking an atom in the sidebar
  const handleAtomClick = useCallback(
    async (atomId: string, pineconeId: string) => {
      setSelectedVectorId(pineconeId)
      await loadAtomById(pineconeId)
    },
    [loadAtomById],
  )

  // Handle clicking a node in the graph
  const handleNodeClick = useCallback(
    async (vectorId: string) => {
      if (!vectorId) {
        setSelectedVectorId(null)
        clearSelection()
        return
      }

      setSelectedVectorId(vectorId)
      await loadAtomById(vectorId)
    },
    [loadAtomById, clearSelection],
  )

  // Calculate the position of the selected vector
  const selectedVectorPosition = selectedVectorId
    ? reducedData.find((d) => d.id === selectedVectorId)?.position
    : undefined

  // Sidebar open change handler - modified to only work on mobile
  const handleSidebarOpenChange = useCallback(
    (open: boolean) => {
      // Only allow toggling sidebar on mobile
      if (isMobile) {
        setSidebarOpen(open)
      }
      // On desktop/laptop widths, sidebar is always open
    },
    [isMobile],
  )

  // Determine if we should show the right panel
  const showRightPanel = atomData !== null || isLoading

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

  // Prepare the right panel content - only used in desktop mode
  const rightPanelContent =
    showRightPanel && !isMobile ? (
      <DetailedAtomCard
        atom={atomData}
        loading={isLoading}
        onClose={clearSelection}
        vectorId={selectedVectorId || undefined}
        position={selectedVectorPosition}
        className="h-full w-full"
      />
    ) : undefined

  // Prepare mobile panel content - separate from right panel
  const mobilePanelContent =
    showRightPanel && isMobile ? (
      <DetailedAtomCard
        atom={atomData}
        loading={isLoading}
        onClose={clearSelection}
        vectorId={selectedVectorId || undefined}
        position={selectedVectorPosition}
        className="w-full h-full"
      />
    ) : undefined

  // Prepare sidebar content
  const sidebarContent = (
    <AtomSidebar onAtomClick={handleAtomClick} selectedAtomId={selectedAtomId} />
  )

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={handleSidebarOpenChange}>
      <FullWidthLayout
        leftSidebar={sidebarContent}
        mainContent={graphContent}
        rightPanel={rightPanelContent}
        mobileBottomPanel={mobilePanelContent}
      />
    </SidebarProvider>
  )
}
