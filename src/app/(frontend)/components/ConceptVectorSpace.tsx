'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Zoom } from '@visx/zoom'
import { localPoint } from '@visx/event'
import { scaleLinear } from '@visx/scale'
import { Group } from '@visx/group'
import { useTooltip } from '@visx/tooltip'
import type { ReducedVectorData } from './ConceptGraph/dimensionReducer'
import { fetchAtomById, AtomData } from './ConceptGraph/fetchVectors'

type ConceptVectorSpaceProps = {
  width: number
  height: number
  reducedData: ReducedVectorData[]
  selectedNodeId?: string | null
  onNodeClick?: (vectorId: string) => void
}

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
  const containerRef = useRef<HTMLDivElement>(null)

  // Log data for debugging
  useEffect(() => {
    console.log('ConceptVectorSpace render:', {
      width,
      height,
      dataPoints: reducedData.length,
      container: containerRef.current?.getBoundingClientRect(),
    })
  }, [width, height, reducedData])

  // Update local state when prop changes
  useEffect(() => {
    if (selectedNodeId !== undefined) {
      setSelectedId(selectedNodeId)
    }
  }, [selectedNodeId])

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

    // Add more generous padding (30%) to ensure points aren't at the edges
    const xPadding = Math.max(0.3, (xMax - xMin) * 0.3)
    const yPadding = Math.max(0.3, (yMax - yMin) * 0.3)

    return {
      xMin: xMin - xPadding,
      xMax: xMax + xPadding,
      yMin: yMin - yPadding,
      yMax: yMax + yPadding,
    }
  }, [reducedData])

  // Use the full container dimensions for visualization
  // Set a minimum size to prevent empty visualization
  const vizWidth = Math.max(width, 100)
  const vizHeight = Math.max(height, 100)

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

  // Points to render - make larger and brighter
  const points = useMemo(() => {
    return reducedData.map((d) => ({
      id: d.id,
      x: xScale(d.position[0]),
      y: yScale(d.position[1]),
      size: d.metadata.text ? 8 : 6, // Larger size for visibility
      color: d.id === selectedId ? '#ff4040' : '#6a4dff', // Brighter colors
      opacity: selectedId && d.id !== selectedId ? 0.6 : 1.0, // Higher opacity
      data: d,
    }))
  }, [reducedData, xScale, yScale, selectedId])

  // Initial zoom transform values - auto fit content
  const initialTransform = useMemo(
    () => ({
      scaleX: 1.0, // Default scale to ensure visibility
      scaleY: 1.0,
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
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${vizWidth} ${vizHeight}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ background: 'rgba(240, 242, 248, 0.8)' }}
        >
          <rect width={vizWidth} height={vizHeight} rx={0} fill="#f3f4f6" fillOpacity={0.5} />

          {/* Debug info */}
          <text x="10" y="20" fontSize="12" fill="#333">
            Points: {points.length} | Container: {width}x{height}
          </text>

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
                stroke={point.id === selectedId ? '#ff4040' : '#fff'}
                strokeWidth={point.id === selectedId ? 2 : 1}
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

  return (
    <div className="w-full h-full relative" ref={containerRef}>
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
