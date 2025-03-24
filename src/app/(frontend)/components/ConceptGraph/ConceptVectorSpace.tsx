'use client'

import { useState, useRef, useEffect } from 'react'
import { Zoom } from '@visx/zoom'
import { localPoint } from '@visx/event'
import { Group } from '@visx/group'
import type { ReducedVectorData } from './dimensionReducer'
import { fetchAtomById, AtomData } from './fetchVectors'
import { useDataBounds } from './hooks/useDataBounds'
import { useVectorScales } from './hooks/useVectorScales'
import { useVectorPoints } from './hooks/useVectorPoints'
import { DataPoint } from './components/DataPoint'

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

  // Calculate bounds, scales, and points
  const bounds = useDataBounds(reducedData)

  // Use the full container dimensions for visualization
  // Set a minimum size to prevent empty visualization
  const vizWidth = Math.max(width, 100)
  const vizHeight = Math.max(height, 100)

  const { xScale, yScale } = useVectorScales(bounds, vizWidth, vizHeight)
  const points = useVectorPoints(reducedData, xScale, yScale, selectedId)

  // Initial zoom transform values - auto fit content
  const initialTransform = {
    scaleX: 1.0, // Default scale to ensure visibility
    scaleY: 1.0,
    translateX: 0,
    translateY: 0,
    skewX: 0,
    skewY: 0,
  }

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
              <DataPoint
                key={point.id}
                x={point.x}
                y={point.y}
                size={point.size}
                color={point.color}
                opacity={point.opacity}
                isSelected={point.id === selectedId}
                data={point.data}
                onClick={() => handlePointClick(point)}
              />
            ))}
          </Group>
        </svg>
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
