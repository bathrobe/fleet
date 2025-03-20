import { fetchAllVectors } from './fetchVectors'
import { ConceptGraphRenderer } from './ConceptGraphRenderer'
import { reduceVectorDimensions } from './dimensionReducer'

export async function ConceptGraphContainer() {
  // Fetch the vector data from Pinecone
  const vectorData = await fetchAllVectors()

  // Log the count of vectors for debugging
  console.log(`Fetched ${vectorData.length} vectors for visualization`)

  // Reduce dimensions with UMAP
  const reducedData = reduceVectorDimensions(vectorData, 2)
  console.log(`Reduced ${reducedData.length} vectors to 2D for visualization`)

  // Pass both the original and reduced data to the client component
  return <ConceptGraphRenderer vectorData={vectorData} reducedData={reducedData} />
}
