'use client'

import { useState, useMemo } from 'react'
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

const defaultMargin = { top: 0, right: 0, bottom: 0, left: 0 }

export const ConceptVectorSpace = ({
  width,
  height,
  reducedData,
  margin = defaultMargin,
}: ConceptVectorSpaceProps & {
  margin?: { top: number; right: number; bottom: number; left: number }
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null)

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

    // Add some padding
    const xPadding = (xMax - xMin) * 0.1
    const yPadding = (yMax - yMin) * 0.1

    return {
      xMin: xMin - xPadding,
      xMax: xMax + xPadding,
      yMin: yMin - yPadding,
      yMax: yMax + yPadding,
    }
  }, [reducedData])

  // Create scales with 1:1 aspect ratio
  const xScale = useMemo(() => {
    return scaleLinear<number>({
      domain: [bounds.xMin, bounds.xMax],
      range: [margin.left, width - margin.right],
    })
  }, [bounds.xMin, bounds.xMax, margin.left, margin.right, width])

  const yScale = useMemo(() => {
    return scaleLinear<number>({
      domain: [bounds.yMin, bounds.yMax],
      range: [height - margin.bottom, margin.top],
    })
  }, [bounds.yMin, bounds.yMax, margin.bottom, margin.top, height])

  // Adjust aspect ratio
  const constrainedHeight = useMemo(() => {
    const xRange = bounds.xMax - bounds.xMin
    const yRange = bounds.yMax - bounds.yMin
    const ratio = xRange / yRange
    const constrainedHeight = width / ratio
    return Math.min(height, constrainedHeight)
  }, [bounds, width, height])

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

  // Initial zoom transform values
  const initialTransform = {
    scaleX: 1,
    scaleY: 1,
    translateX: 0,
    translateY: 0,
    skewX: 0,
    skewY: 0,
  }

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

  // Render function that works with Zoom
  const render = (zoom: any) => {
    const { translateX, translateY, scaleX, scaleY } = zoom.transformMatrix

    return (
      <>
        <svg width={width} height={constrainedHeight}>
          <rect width={width} height={constrainedHeight} rx={14} fill="#f3f4f6" fillOpacity={0.5} />
          <Group transform={zoom.toString()}>
            {/* Minimal Grid */}
            <line
              x1={xScale(0)}
              y1={yScale(bounds.yMin)}
              x2={xScale(0)}
              y2={yScale(bounds.yMax)}
              stroke="#e5e7eb"
              strokeWidth={1}
              strokeDasharray="4,4"
            />
            <line
              x1={xScale(bounds.xMin)}
              y1={yScale(0)}
              x2={xScale(bounds.xMax)}
              y2={yScale(0)}
              stroke="#e5e7eb"
              strokeWidth={1}
              strokeDasharray="4,4"
            />

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
                    ? tooltipData.metadata.text.substring(0, 50) +
                      (tooltipData.metadata.text.length > 50 ? '...' : '')
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
    <div>
      <Zoom
        width={width}
        height={constrainedHeight}
        scaleXMin={0.1}
        scaleXMax={10}
        scaleYMin={0.1}
        scaleYMax={10}
        initialTransformMatrix={initialTransform}
      >
        {render}
      </Zoom>

      {selectedId && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded">
          <h3 className="font-medium">Selected Point</h3>
          {(() => {
            const point = reducedData.find((d) => d.id === selectedId)
            if (!point) return null

            return (
              <>
                <div className="mt-2">
                  {point.metadata.text && <div className="text-sm">{point.metadata.text}</div>}
                  <div className="text-xs text-gray-500 mt-1">
                    Position: [{point.position.map((n) => n.toFixed(3)).join(', ')}]
                  </div>
                  <div className="text-xs text-gray-500">ID: {point.id}</div>
                </div>
                <button
                  onClick={() => setSelectedId(null)}
                  className="mt-2 px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Clear Selection
                </button>
              </>
            )
          })()}
        </div>
      )}
    </div>
  )
}
