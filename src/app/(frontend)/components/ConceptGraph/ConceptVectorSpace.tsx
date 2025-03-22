'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Zoom } from '@visx/zoom'
import { localPoint } from '@visx/event'
import { scaleLinear } from '@visx/scale'
import { Group } from '@visx/group'
import { useTooltip } from '@visx/tooltip'
import type { ReducedVectorData } from './dimensionReducer'

type ConceptVectorSpaceProps = {
  width: number
  height: number
  reducedData: ReducedVectorData[]
}

// Fixed dimensions instead of dynamic ones
const PANEL_HEIGHT = 600

export const ConceptVectorSpace = ({ width, height, reducedData }: ConceptVectorSpaceProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null)
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
      size: d.metadata.text || d.atomData ? 5 : 3,
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

  // Handle point click
  const handlePointClick = (point: (typeof points)[0]) => {
    setSelectedId(point.id === selectedId ? null : point.id)
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
                  {tooltipData.atomData?.title || tooltipData.metadata.text
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

    if (!selectedPoint) {
      return (
        <div className="w-full h-full flex items-center justify-center text-gray-600">
          Selected point data not found.
        </div>
      )
    }

    const atomData = selectedPoint.atomData

    return (
      <div className="h-full p-6 overflow-auto">
        {atomData ? (
          <>
            <h3 className="font-medium text-xl border-b pb-2 mb-4 text-red-500">
              {atomData.title || 'Atom Details'}
            </h3>

            <div className="space-y-4">
              {/* Main Content */}
              {atomData.mainContent && (
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Main Content
                  </h4>
                  <div className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">
                    {atomData.mainContent}
                  </div>
                </div>
              )}

              {/* Supporting Quote */}
              {atomData.supportingQuote && (
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Supporting Quote
                  </h4>
                  <div className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded border-l-4 border-gray-300 dark:border-gray-600 italic">
                    {atomData.supportingQuote}
                  </div>
                </div>
              )}

              {/* Supporting Info */}
              {atomData.supportingInfo && (
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Supporting Information
                  </h4>
                  <div className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">
                    {typeof atomData.supportingInfo === 'string'
                      ? atomData.supportingInfo
                      : Array.isArray(atomData.supportingInfo)
                        ? atomData.supportingInfo.map((info: any, i) => (
                            <div key={i}>{typeof info === 'string' ? info : info.text}</div>
                          ))
                        : JSON.stringify(atomData.supportingInfo)}
                  </div>
                </div>
              )}

              {/* Source */}
              {atomData.source && (
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Source</h4>
                  <div className="text-sm">{atomData.source.title || atomData.source.id}</div>
                </div>
              )}

              {/* Vector Details */}
              <div className="mt-6 border-t pt-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Vector Details
                </h4>
                <div className="text-xs text-gray-500 grid grid-cols-2 gap-2">
                  <div>Vector ID:</div>
                  <div>{selectedId}</div>
                  <div>Position:</div>
                  <div>[{selectedPoint.position.map((n) => n.toFixed(3)).join(', ')}]</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <h3 className="font-medium text-lg mb-3 text-red-500">Vector Information</h3>
            <div className="text-sm">
              <p className="mb-2 text-amber-600 dark:text-amber-400">
                No atom record found for this vector ID.
              </p>

              {selectedPoint.metadata.text && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Metadata Text
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                    {selectedPoint.metadata.text}
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 mt-4">
                <div className="mb-1">Vector ID: {selectedId}</div>
                <div>Position: [{selectedPoint.position.map((n) => n.toFixed(3)).join(', ')}]</div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setSelectedId(null)}
          className="mt-6 px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Clear Selection
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      <div
        className="md:w-1/2 h-[600px] bg-white dark:bg-gray-900 overflow-auto border-r border-gray-200 dark:border-gray-700"
        ref={rightPanelRef}
        style={{ width: panelWidth ? `${panelWidth}px` : '50%', minWidth: '300px' }}
      >
        {renderInfoPanel()}
      </div>
      <div
        className="md:w-1/2 h-[600px] relative bg-gray-50 dark:bg-gray-800"
        ref={leftPanelRef}
        style={{ width: panelWidth ? `${panelWidth}px` : '50%', minWidth: '300px' }}
      >
        <Zoom
          width={vizWidth}
          height={vizHeight}
          scaleXMin={0.1}
          scaleXMax={10}
          scaleYMin={0.1}
          scaleYMax={10}
          initialTransformMatrix={initialTransform}
        >
          {render}
        </Zoom>
      </div>
    </div>
  )
}
