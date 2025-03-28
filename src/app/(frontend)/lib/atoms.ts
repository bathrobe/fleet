// Type definitions for atoms
export type Atom = {
  id: string | number
  title?: string
  mainContent: string
  supportingQuote?: string
  supportingInfo?: { text: string }[]
  source?: {
    id: string | number
    title?: string
  }
  pineconeId?: string
  [key: string]: any
}

// Calculate cosine similarity between two vectors
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }

  if (normA === 0 || normB === 0) {
    return 0
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

// Find the N most dissimilar vectors to a given vector
export function findMostDissimilarVectors(
  baseVector: number[],
  vectors: { id: string; vector: number[] }[],
  count: number = 5,
): string[] {
  // Calculate similarities for all vectors
  const similarities = vectors.map((item) => ({
    id: item.id,
    similarity: cosineSimilarity(baseVector, item.vector),
  }))

  // Sort by similarity (ascending to get the most dissimilar first)
  similarities.sort((a, b) => a.similarity - b.similarity)

  // Return the IDs of the most dissimilar vectors
  return similarities.slice(0, count).map((item) => item.id)
}
