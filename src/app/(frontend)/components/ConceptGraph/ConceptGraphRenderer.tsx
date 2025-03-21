'use client'

import { useState, useRef, useEffect } from 'react'
import type { VectorData } from './fetchVectors'
import type { ReducedVectorData } from './dimensionReducer'
import { ConceptVectorSpace } from './ConceptVectorSpace'

type ConceptGraphRendererProps = {
  vectorData: VectorData[]
  reducedData: ReducedVectorData[]
}

export function ConceptGraphRenderer({ vectorData, reducedData }: ConceptGraphRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(1000)
  const [containerHeight, setContainerHeight] = useState(600)

  // Update container dimensions on mount and resize
  useEffect(() => {
    if (!containerRef.current) return

    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth)
        setContainerHeight(containerRef.current.clientHeight)
      }
    }

    // Set initial dimensions
    updateDimensions()

    // Set up resize observer to track container size changes
    const resizeObserver = new ResizeObserver(updateDimensions)
    resizeObserver.observe(containerRef.current)

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current)
      }
    }
  }, [])

  return (
    <div className="p-0">
      <h2 className="text-xl font-bold mb-2">Concept Vector Visualization</h2>
      <div className="mb-2 text-sm">
        <span className="text-gray-600">
          Loaded {vectorData.length} vectors, reduced to {reducedData.length} 2D coordinates.
          Original dimension: {vectorData[0]?.vector.length || 'unknown'} → Reduced to:{' '}
          {reducedData[0]?.position.length || 'unknown'}D
        </span>
      </div>

      {/* Full-width container with no padding that adapts to available space */}
      <div
        className="bg-white dark:bg-gray-900 p-0 overflow-hidden h-[600px] w-full"
        ref={containerRef}
      >
        <ConceptVectorSpace
          width={containerWidth}
          height={containerHeight}
          reducedData={reducedData}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        />
      </div>

      <div className="mt-2 text-xs text-gray-500">
        <span>
          UMAP dimensionality reduction. Semantic similarity shown by distance between points.
          <strong> Interactions:</strong> Zoom with mouse wheel, pan by dragging, click points for
          details.
        </span>
      </div>
    </div>
  )
}
