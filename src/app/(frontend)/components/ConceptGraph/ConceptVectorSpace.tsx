'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Zoom } from '@visx/zoom'
import { localPoint } from '@visx/event'
import { scaleLinear } from '@visx/scale'
import { Group } from '@visx/group'
import { useTooltip } from '@visx/tooltip'
// import type { ReducedVectorData } from './dimensionReducer'
import { fetchAtomById, AtomData } from './fetchVectors'
import { AtomCard } from '../AtomDisplay/AtomCard'

type ConceptVectorSpaceProps = {
  width: number
  height: number
  reducedData: any[]
  selectedNodeId?: string | null
  onNodeClick?: (vectorId: string) => void
}

// Fixed dimensions instead of dynamic ones
const PANEL_HEIGHT = 600

export const ConceptVectorSpace = ({
  width,
  height,
  reducedData,
  selectedNodeId,
  onNodeClick,
}: ConceptVectorSpaceProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(selectedNodeId || null)
  const [selectedAtomData, setSelectedAtomData] = useState<AtomData | null>(null)
  const [isLoadingAtom, setIsLoadingAtom] = useState<boolean>(false)
  const leftPanelRef = useRef<HTMLDivElement>(null)
  const rightPanelRef = useRef<HTMLDivElement>(null)
  const [panelWidth, setPanelWidth] = useState(0)

  // Update measurements when the component mounts or resizes
  useEffect(() => {
    const updatePanelWidths = () => {
      if (leftPanelRef.current && rightPanelRef.current) {
        // Make sure both panels have the same width
        const width = Math.floor(window.innerWidth / 2) - 24 // Account for some padding
        setPanelWidth(width)
      }
    }

    // Initial measurement
    updatePanelWidths()

    // Listen for window resize
    window.addEventListener('resize', updatePanelWidths)

    return () => {
      window.removeEventListener('resize', updatePanelWidths)
    }
  }, [])

  // Update local state when prop changes
  useEffect(() => {
    if (selectedNodeId !== undefined) {
      setSelectedId(selectedNodeId)
    }
  }, [selectedNodeId])

  // Set up tooltip
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } =
    useTooltip<any>()

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

  // Fixed ratio visualization
  const vizWidth = panelWidth || 500
  const vizHeight = PANEL_HEIGHT

  // Create scales - ensure equal scaling on both axes for dimensional accuracy
  const xScale = useMemo(() => {
    const size = Math.max(Math.abs(bounds.xMax - bounds.xMin), Math.abs(bounds.yMax - bounds.yMin))
    const midX = (bounds.xMax + bounds.xMin) / 2

    return scaleLinear<number>({
      domain: [midX - size / 2, midX + size / 2],
      range: [0, vizWidth],
    })
  }, [bounds, vizWidth])

  const yScale = useMemo(() => {
    const size = Math.max(Math.abs(bounds.xMax - bounds.xMin), Math.abs(bounds.yMax - bounds.yMin))
    const midY = (bounds.yMax + bounds.yMin) / 2

    return scaleLinear<number>({
      domain: [midY - size / 2, midY + size / 2],
      range: [vizHeight, 0], // Inverted for SVG
    })
  }, [bounds, vizHeight])

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

    // If external handler is provided, use it
    if (onNodeClick) {
      onNodeClick(point.id)
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

  // Render function that works with Zoom
  const render = (zoom: any) => {
    return (
      <>
        <svg width={vizWidth} height={vizHeight}>
          <rect width={vizWidth} height={vizHeight} rx={0} fill="#f3f4f6" fillOpacity={0.5} />
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

  // Render the info panel for selected node
  const renderInfoPanel = () => {
    if (!selectedId) {
      return (
        <div className="w-full h-full flex items-center justify-center text-gray-400 italic">
          No node selected. Click a point to view details.
        </div>
      )
    }

    const handleClose = () => {
      setSelectedId(null)
      setSelectedAtomData(null)
    }

    return (
      <div className="h-full">
        <AtomCard
          atom={selectedAtomData}
          loading={isLoadingAtom}
          onClose={handleClose}
          vectorId={selectedId}
          position={selectedPoint?.position}
        />
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <Zoom<SVGSVGElement>
        width={vizWidth}
        height={vizHeight}
        scaleXMin={0.1}
        scaleXMax={5}
        scaleYMin={0.1}
        scaleYMax={5}
        initialTransformMatrix={initialTransform}
      >
        {(zoom) => render(zoom)}
      </Zoom>
    </div>
  )
}
