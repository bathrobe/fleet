'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { Zoom } from '@visx/zoom'
import { localPoint } from '@visx/event'
import { scaleLinear } from '@visx/scale'
import { Group } from '@visx/group'
import { useTooltip } from '@visx/tooltip'
import type { ReducedVectorData } from './dimensionReducer'
import { fetchAtomById, AtomData } from './fetchVectors'
import { AtomCard } from '../AtomDisplay/AtomCard'
import { useSidebar } from '../ui/sidebar'
import { Menu, X } from 'lucide-react'

type ConceptVectorSpaceProps = {
  width: number
  height: number
  reducedData: ReducedVectorData[]
  selectedNodeId?: string | null
  onNodeClick?: (vectorId: string) => void
  externalAtomData?: AtomData | null
  isLoadingExternalAtom?: boolean
}

export const ConceptVectorSpace = ({
  width,
  height,
  reducedData,
  selectedNodeId,
  onNodeClick,
  externalAtomData,
  isLoadingExternalAtom = false,
}: ConceptVectorSpaceProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(selectedNodeId || null)
  const [selectedAtomData, setSelectedAtomData] = useState<AtomData | null>(null)
  const [isLoadingAtom, setIsLoadingAtom] = useState<boolean>(false)
  const sidebar = useSidebar()
  const { isMobile, open: sidebarOpen, setOpen: setSidebarOpen } = sidebar

  const plotContainerRef = useRef<HTMLDivElement>(null)
  const atomCardRef = useRef<HTMLDivElement>(null)

  // Update local state when prop changes
  useEffect(() => {
    if (selectedNodeId !== undefined) {
      setSelectedId(selectedNodeId)
    }
  }, [selectedNodeId])

  // Use external atom data when provided
  useEffect(() => {
    if (externalAtomData) {
      setSelectedAtomData(externalAtomData)
    }
  }, [externalAtomData])

  // Close sidebar when an atom is selected on mobile
  useEffect(() => {
    if (isMobile && selectedId && sidebarOpen) {
      setSidebarOpen(false)
    }
  }, [selectedId, isMobile, sidebarOpen, setSidebarOpen])

  // Set up tooltip
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } =
    useTooltip<ReducedVectorData>()

  // Determine the bounds to properly display all data points
  const bounds = useMemo(() => {
    if (reducedData.length === 0) return { xMin: -1, xMax: 1, yMin: -1, yMax: 1 }

    let xMin = Infinity
    let xMax = -Infinity
    let yMin = Infinity
    let yMax = -Infinity

    reducedData.forEach((d) => {
      const x = d.position[0]
      const y = d.position[1]
      if (x < xMin) xMin = x
      if (x > xMax) xMax = x
      if (y < yMin) yMin = y
      if (y > yMax) yMax = y
    })

    // Add more generous padding (20%) to ensure points aren't at the edges
    const xPadding = Math.max(0.2, (xMax - xMin) * 0.2)
    const yPadding = Math.max(0.2, (yMax - yMin) * 0.2)

    return {
      xMin: xMin - xPadding,
      xMax: xMax + xPadding,
      yMin: yMin - yPadding,
      yMax: yMax + yPadding,
    }
  }, [reducedData])

  // Calculate dimensions based on selection state and device
  const vizDimensions = useMemo(() => {
    if (isMobile && selectedId) {
      // When atom is selected on mobile, use top half of screen
      return {
        width,
        height: height / 2,
      }
    }
    // Default: use full container dimensions
    return {
      width,
      height,
    }
  }, [width, height, selectedId, isMobile])

  // Create scales - ensure equal scaling on both axes for dimensional accuracy
  const xScale = useMemo(() => {
    const size = Math.max(Math.abs(bounds.xMax - bounds.xMin), Math.abs(bounds.yMax - bounds.yMin))
    const midX = (bounds.xMax + bounds.xMin) / 2

    return scaleLinear<number>({
      domain: [midX - size / 2, midX + size / 2],
      range: [0, vizDimensions.width],
    })
  }, [bounds, vizDimensions.width])

  const yScale = useMemo(() => {
    const size = Math.max(Math.abs(bounds.xMax - bounds.xMin), Math.abs(bounds.yMax - bounds.yMin))
    const midY = (bounds.yMax + bounds.yMin) / 2

    return scaleLinear<number>({
      domain: [midY - size / 2, midY + size / 2],
      range: [vizDimensions.height, 0], // Inverted for SVG
    })
  }, [bounds, vizDimensions.height])

  // Points to render
  const points = useMemo(() => {
    return reducedData.map((d) => ({
      id: d.id,
      x: xScale(d.position[0]),
      y: yScale(d.position[1]),
      size: d.metadata.text ? 5 : 3,
      color: d.id === selectedId ? '#ff6b6b' : '#8884d8',
      opacity: selectedId && d.id !== selectedId ? 0.4 : 0.8,
      data: d,
    }))
  }, [reducedData, xScale, yScale, selectedId])

  // Initial zoom transform values - auto fit content
  const initialTransform = useMemo(
    () => ({
      scaleX: 0.9, // Slight zoom out to ensure all points are visible
      scaleY: 0.9,
      translateX: 0,
      translateY: 0,
      skewX: 0,
      skewY: 0,
    }),
    [],
  )

  // Load atom data when a point is clicked
  const loadAtomData = async (pointId: string) => {
    if (!pointId) return

    try {
      setIsLoadingAtom(true)
      const atomData = await fetchAtomById(pointId)
      setSelectedAtomData(atomData)
    } catch (error) {
      console.error('Error loading atom data:', error)
      setSelectedAtomData(null)
    } finally {
      setIsLoadingAtom(false)
    }
  }

  // Handle point click
  const handlePointClick = async (point: (typeof points)[0]) => {
    // If clicking the same point, deselect it
    if (point.id === selectedId && !onNodeClick) {
      setSelectedId(null)
      setSelectedAtomData(null)
      return
    }

    // Select the new point
    setSelectedId(point.id)

    // Close sidebar if open on mobile
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false)
    }

    // If external handler is provided, use it
    if (onNodeClick) {
      onNodeClick(point.id)

      // Also load data locally for mobile view if external callback is provided
      if (isMobile) {
        await loadAtomData(point.id)
      }
    } else {
      // Otherwise, use internal loading
      await loadAtomData(point.id)
    }
  }

  // Handle point hover
  const handlePointHover = (
    point: (typeof points)[0],
    event: React.MouseEvent | React.TouchEvent,
  ) => {
    const coords = localPoint(event)
    showTooltip({
      tooltipData: point.data,
      tooltipLeft: coords?.x,
      tooltipTop: coords?.y,
    })
  }

  // Get selected point data
  const selectedPoint = useMemo(() => {
    if (!selectedId) return null
    return reducedData.find((d) => d.id === selectedId)
  }, [selectedId, reducedData])

  // Toggle sidebar
  const toggleSidebar = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      console.log('Toggling sidebar from:', sidebarOpen, 'to:', !sidebarOpen)
      setSidebarOpen(!sidebarOpen)
    },
    [sidebarOpen, setSidebarOpen],
  )

  // Close atom selection
  const handleCloseAtom = () => {
    setSelectedId(null)
    setSelectedAtomData(null)

    // Notify parent if callback exists
    if (onNodeClick) {
      onNodeClick(null as any)
    }
  }

  // Determine which atom data to use
  const displayAtomData = externalAtomData || selectedAtomData
  const isLoading = isLoadingExternalAtom || isLoadingAtom

  // Render function that works with Zoom
  const render = (zoom: any) => {
    return (
      <>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${vizDimensions.width} ${vizDimensions.height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <rect
            width={vizDimensions.width}
            height={vizDimensions.height}
            rx={0}
            fill="#f3f4f6"
            fillOpacity={0.5}
          />
          <Group transform={zoom.toString()}>
            {/* Render points */}
            {points.map((point) => (
              <circle
                key={point.id}
                cx={point.x}
                cy={point.y}
                r={point.size}
                fill={point.color}
                fillOpacity={point.opacity}
                stroke={point.id === selectedId ? '#ff6b6b' : 'none'}
                strokeWidth={point.id === selectedId ? 2 : 0}
                onClick={() => handlePointClick(point)}
                onMouseEnter={(e) => handlePointHover(point, e)}
                onMouseLeave={hideTooltip}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </Group>
        </svg>

        {tooltipOpen && tooltipData && (
          <div
            style={{
              position: 'absolute',
              top: tooltipTop,
              left: tooltipLeft,
              transform: 'translate(-50%, -100%)',
              pointerEvents: 'none',
              zIndex: 50,
            }}
          >
            <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-lg border border-gray-200 dark:border-gray-700 text-sm">
              <div className="max-w-xs">
                <div className="font-medium">
                  {tooltipData.metadata.text
                    ? tooltipData.metadata.text?.substring(0, 50) +
                      (tooltipData.metadata.text && tooltipData.metadata.text.length > 50
                        ? '...'
                        : '')
                    : tooltipData.id}
                </div>
                <div className="text-xs text-gray-500 mt-1">ID: {tooltipData.id}</div>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="w-full h-full relative">
      {/* Scatter plot container */}
      <div
        ref={plotContainerRef}
        className={`transition-all duration-300 ease-in-out ${
          isMobile && selectedId ? 'h-1/2' : 'h-full'
        }`}
        style={{ position: 'relative' }}
      >
        <Zoom<SVGSVGElement>
          width={vizDimensions.width}
          height={vizDimensions.height}
          scaleXMin={0.1}
          scaleXMax={5}
          scaleYMin={0.1}
          scaleYMax={5}
          initialTransformMatrix={initialTransform}
        >
          {(zoom) => render(zoom)}
        </Zoom>
      </div>

      {/* Atom card container - bottom half on mobile */}
      {isMobile && selectedId && (
        <div
          ref={atomCardRef}
          className="fixed bottom-0 left-0 right-0 h-1/2 overflow-hidden transition-all duration-300 ease-in-out"
          style={{ zIndex: 40 }}
        >
          <AtomCard
            atom={displayAtomData}
            loading={isLoading}
            onClose={handleCloseAtom}
            vectorId={selectedId}
            position={selectedPoint?.position}
            className="h-full rounded-t-xl shadow-lg"
          />
        </div>
      )}
    </div>
  )
}
