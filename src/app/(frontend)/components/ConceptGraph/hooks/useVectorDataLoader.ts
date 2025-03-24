import { useState, useEffect } from 'react'
import { fetchAllVectors } from '../fetchVectors'
import { reduceVectorDimensions } from '../dimensionReducer'
import type { VectorData } from '../fetchVectors'
import type { ReducedVectorData } from '../dimensionReducer'

export const useVectorDataLoader = () => {
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

  return { vectorData, reducedData, isLoading, error }
}
