'use server'

// Import the Pinecone library
import { Pinecone } from '@pinecone-database/pinecone'
import { formatAtomForEmbedding } from './atoms'
import { v4 as uuidv4 } from 'uuid'

// Initialize a Pinecone client with your API key
export async function upsertVectors(atom: any) {
  if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY is not set')
  }
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })

  const namespace = pc.index('fleet', process.env.PINECONE_URL).namespace('atoms')
  const pineconeAtomId = uuidv4()
  const record = {
    id: pineconeAtomId,
    text: formatAtomForEmbedding(atom),
    payloadAtomId: atom.id,
    payloadSourceId: atom.source.id,
  }
  await namespace.upsertRecords([record])
  return {
    pineconeAtomId,
    payloadAtomId: atom.id,
    payloadSourceId: atom.source.id,
  }
}
