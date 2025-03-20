'use client'

import { useState } from 'react'
import type { VectorData } from './fetchVectors'
import type { ReducedVectorData } from './dimensionReducer'

type ConceptGraphRendererProps = {
  vectorData: VectorData[]
  reducedData: ReducedVectorData[]
}

export function ConceptGraphRenderer({ vectorData, reducedData }: ConceptGraphRendererProps) {
  const [selectedVectorId, setSelectedVectorId] = useState<string | null>(null)

  // For now, just display some basic stats about the data
  // Later we'll replace this with the actual visualization
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

      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
        <p className="mb-2">
          The vectors have been reduced from {vectorData[0]?.vector.length || 'unknown'}-dimensional
          space to {reducedData[0]?.position.length || 'unknown'}-dimensional space using UMAP
        </p>
        <p className="text-sm text-gray-500">
          Next step: Visualize these reduced coordinates in a graph
        </p>
      </div>

      {/* Display a few sample vectors with their reduced coordinates */}
      <div className="mt-6">
        <h3 className="font-medium mb-2">Sample reduced vectors:</h3>
        <ul className="list-disc pl-5">
          {reducedData.slice(0, 5).map((vector) => (
            <li
              key={vector.id}
              className="cursor-pointer hover:text-blue-500"
              onClick={() => setSelectedVectorId(vector.id === selectedVectorId ? null : vector.id)}
            >
              ID: {vector.id} → Position: [{vector.position.map((n) => n.toFixed(3)).join(', ')}]
              {selectedVectorId === vector.id && (
                <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 mt-1 rounded overflow-auto">
                  {JSON.stringify(vector.metadata, null, 2)}
                </pre>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
