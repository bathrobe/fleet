'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { Zoom } from '@visx/zoom'
import { localPoint } from '@visx/event'
import { scaleLinear } from '@visx/scale'
import { Group } from '@visx/group'
import { useTooltip } from '@visx/tooltip'
import { LinePath } from '@visx/shape'
import type { ReducedVectorData } from './dimensionReducer'
import { fetchAtomById, AtomData } from './fetchVectors'

type ConceptVectorSpaceProps = {
  width: number
  height: number
  reducedData: ReducedVectorData[]
  selectedNodeId?: string | null
  onNodeClick?: (vectorId: string) => void
}

// Add color constants for different atom types
const REGULAR_ATOM_COLOR = '#3B82F6' // Blue
const SYNTHESIZED_ATOM_COLOR = '#10B981' // Green
const PARENT_EDGE_COLOR = '#8B5CF6' // Purple
const PARENT_HIGHLIGHT_COLOR = '#EC4899' // Pink

// Update the rendering function to check for synthesized atom type
const getPointColor = (point: any, isParentOfSelected: boolean = false) => {
  if (isParentOfSelected) return PARENT_HIGHLIGHT_COLOR
  return point.metadata?.type === 'synthesized' ? SYNTHESIZED_ATOM_COLOR : REGULAR_ATOM_COLOR
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
  const [parentAtomIds, setParentAtomIds] = useState<string[]>([])
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
      // Clear parent atom IDs immediately when selection changes
      if (selectedId !== selectedNodeId) {
        setParentAtomIds([])
      }

      setSelectedId(selectedNodeId)

      // When selection changes, load parent atom data if applicable
      if (selectedNodeId) {
        loadAtomData(selectedNodeId)
      } else {
        setSelectedAtomData(null)
        setParentAtomIds([])
      }
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

  // Extract parent atom IDs from the selected synthesized atom
  const extractParentAtomIds = useCallback((atomData: AtomData) => {
    if (!atomData || !atomData.isSynthesized || !atomData.parentAtoms) {
      return []
    }

    // Extract pineconeIds from parent atoms
    const parentIds = atomData.parentAtoms
      .filter((parent: any) => parent && parent.pineconeId)
      .map((parent: any) => parent.pineconeId)

    console.log('Parent atom IDs:', parentIds)
    return parentIds
  }, [])

  // Points to render - make larger and brighter
  const points = useMemo(() => {
    return reducedData.map((d) => {
      const isParentOfSelected = parentAtomIds.includes(d.id)

      return {
        id: d.id,
        x: xScale(d.position[0]),
        y: yScale(d.position[1]),
        size: d.metadata.text ? 8 : 6, // Larger size for visibility
        color: d.id === selectedId ? '#ff4040' : getPointColor(d, isParentOfSelected),
        opacity: selectedId && !isParentOfSelected && d.id !== selectedId ? 0.6 : 1.0,
        data: d,
        isParentOfSelected,
      }
    })
  }, [reducedData, xScale, yScale, selectedId, parentAtomIds])

  // Prepare edges between synthesized atom and parent atoms
  const edges = useMemo(() => {
    if (!selectedId || parentAtomIds.length === 0) return []

    const selectedPoint = points.find((p) => p.id === selectedId)
    if (!selectedPoint) return []

    return parentAtomIds
      .map((parentId) => {
        const parentPoint = points.find((p) => p.id === parentId)
        if (!parentPoint) return null

        return {
          id: `${selectedId}-${parentId}`,
          source: selectedPoint,
          target: parentPoint,
          color: PARENT_EDGE_COLOR,
        }
      })
      .filter((edge) => edge !== null) as { id: string; source: any; target: any; color: string }[]
  }, [selectedId, parentAtomIds, points])

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

      // If this is a synthesized atom, extract parent atom IDs
      if (atomData && atomData.isSynthesized) {
        const parentIds = extractParentAtomIds(atomData)
        setParentAtomIds(parentIds)
      } else {
        setParentAtomIds([])
      }
    } catch (error) {
      console.error('Error loading atom data:', error)
      setSelectedAtomData(null)
      setParentAtomIds([])
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
      setParentAtomIds([])
      return
    }

    // Clear parent atom IDs immediately when selecting a new atom
    if (point.id !== selectedId) {
      setParentAtomIds([])
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

          <Group transform={zoom.toString()}>
            {/* Render edges connecting synthesized atom to parent atoms */}
            {edges.map((edge) => (
              <LinePath
                key={edge.id}
                data={[
                  { x: edge.source.x, y: edge.source.y },
                  { x: edge.target.x, y: edge.target.y },
                ]}
                x={(d: { x: number; y: number }) => d.x}
                y={(d: { x: number; y: number }) => d.y}
                stroke={edge.color}
                strokeWidth={2}
                strokeOpacity={0.7}
                strokeDasharray="5,5"
                shapeRendering="geometricPrecision"
              />
            ))}

            {/* Render points */}
            {points.map((point) => (
              <circle
                key={point.id}
                cx={point.x}
                cy={point.y}
                r={point.isParentOfSelected ? point.size + 2 : point.size}
                fill={point.color}
                fillOpacity={point.opacity}
                stroke={
                  point.id === selectedId
                    ? '#ff4040'
                    : point.isParentOfSelected
                      ? PARENT_HIGHLIGHT_COLOR
                      : '#fff'
                }
                strokeWidth={point.id === selectedId || point.isParentOfSelected ? 2 : 1}
                onClick={() => handlePointClick(point)}
                style={{ cursor: 'pointer' }}
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
