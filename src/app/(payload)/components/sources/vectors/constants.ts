// Constants for Pinecone vector database
export const INDEX_NAME = 'fleet'
export const NAMESPACE = 'atoms'
export const INDEX_HOST = process.env.PINECONE_URL // The host URL for your index

// Type definitions for vector operations
export interface VectorMetadata {
  [key: string]: string | number | string[] | boolean | null
}

export interface VectorRecord {
  _id: string
  text: string
  [key: string]: any
}
