import { UMAP } from 'umap-js'
import type { VectorData, AtomData } from './fetchVectors'

export type ReducedVectorData = {
  id: string
  position: number[]
  metadata: VectorData['metadata']
  originalVector: number[]
  atomData?: AtomData | null
}

/**
 * Reduces high-dimensional vectors to 2D/3D using UMAP
 *
 * @param vectorData The original vector data from Pinecone
 * @param dimensions The number of dimensions to reduce to (2 or 3)
 * @returns Array of vector data with reduced dimensional positions
 */
export function reduceVectorDimensions(
  vectorData: VectorData[],
  dimensions: 2 | 3 = 2,
): ReducedVectorData[] {
  // If we have no data, return empty array
  if (vectorData.length === 0) return []

  // Extract just the vectors for UMAP
  const vectors = vectorData.map((item) => item.vector)

  // Configure UMAP
  const umap = new UMAP({
    nComponents: dimensions,
    nNeighbors: 5, // Balance between local and global structure
    minDist: 0.1, // How tightly points cluster together
    spread: 1.0, // How spread out the points are
  })

  // Fit the data and get the embedding
  const reducedVectors = umap.fit(vectors)

  // Combine the reduced coordinates with the original metadata
  return vectorData.map((item, index) => ({
    id: item.id,
    position: reducedVectors[index],
    metadata: item.metadata,
    originalVector: item.vector,
    atomData: item.atomData,
  }))
}
