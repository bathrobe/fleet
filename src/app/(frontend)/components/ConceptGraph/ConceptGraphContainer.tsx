'use client'

import { useState, useEffect } from 'react'
import { fetchAllVectors } from './fetchVectors'
import { ConceptGraphWithSidebar } from './ConceptGraphWithSidebar'
import { reduceVectorDimensions } from './dimensionReducer'
import type { VectorData } from './fetchVectors'
import type { ReducedVectorData } from './dimensionReducer'

export function ConceptGraphContainer() {
  const [vectorData, setVectorData] = useState<VectorData[]>([])
  const [reducedData, setReducedData] = useState<ReducedVectorData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadVectorData() {
      try {
        setIsLoading(true)
        // Fetch the vector data from Pinecone without atom data
        const data = await fetchAllVectors()

        // Reduce dimensions with UMAP
        const reduced = reduceVectorDimensions(data, 2)

        setVectorData(data)
        setReducedData(reduced)
      } catch (err) {
        console.error('Error loading vector data:', err)
        setError('Failed to load concept graph data')
      } finally {
        setIsLoading(false)
      }
    }

    loadVectorData()
  }, [])

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  if (isLoading) {
    return <div className="p-4">Loading concept graph...</div>
  }

  return <ConceptGraphWithSidebar vectorData={vectorData} reducedData={reducedData} />
}
