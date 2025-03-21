'use client'

import { useState } from 'react'
import type { VectorData } from './fetchVectors'
import type { ReducedVectorData } from './dimensionReducer'
import { ConceptVectorSpace } from './ConceptVectorSpace'

type ConceptGraphRendererProps = {
  vectorData: VectorData[]
  reducedData: ReducedVectorData[]
}

export function ConceptGraphRenderer({ vectorData, reducedData }: ConceptGraphRendererProps) {
  const [selectedVectorId, setSelectedVectorId] = useState<string | null>(null)

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Concept Vector Visualization</h2>
      <div className="mb-4">
        <p className="text-gray-600">
          Loaded {vectorData.length} vectors, reduced to {reducedData.length} 2D coordinates.
        </p>
        <p className="text-gray-600">
          Original dimension: {vectorData[0]?.vector.length || 'unknown'} → Reduced to:{' '}
          {reducedData[0]?.position.length || 'unknown'}D
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
        <ConceptVectorSpace
          width={900}
          height={600}
          reducedData={reducedData}
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        />
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>
          This visualization shows concept vectors in 2D space after dimensionality reduction with
          UMAP. The relative distances between points represent semantic similarity.
        </p>
        <p className="mt-1">
          <strong>Interactions:</strong> Zoom with mouse wheel, pan by dragging, click points to
          view details.
        </p>
      </div>
    </div>
  )
}
