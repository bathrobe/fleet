'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { Pinecone } from '@pinecone-database/pinecone'
import { v4 as uuidv4 } from 'uuid'

/**
 * Formats a synthesized atom's content into a single string for vector embedding
 */
const formatSynthesizedAtomForEmbedding = (atom: any): string => {
  if (!atom) return ''

  const parts: string[] = []

  // Add title with emphasis if it exists
  if (atom.title) {
    parts.push(atom.title)
  }

  // Add main content if it exists
  if (atom.mainContent) {
    parts.push(atom.mainContent)
  }

  // Add supporting info as a list if it exists
  if (atom.supportingInfo && Array.isArray(atom.supportingInfo)) {
    const supportingTexts = atom.supportingInfo.map((info: any) => info.text).filter(Boolean)
    if (supportingTexts.length > 0) {
      parts.push(supportingTexts.join('\n'))
    }
  }

  // Add theory fiction if it exists
  if (atom.theoryFiction) {
    parts.push(atom.theoryFiction)
  }

  return parts.join('\n\n')
}

export async function saveSynthesizedAtom(atom: any) {
  try {
    const payload = await getPayload({ config })

    // Create the atom in Payload
    const savedAtom = await payload.create({
      collection: 'synthesizedAtoms',
      data: {
        title: atom.title,
        mainContent: atom.mainContent,
        supportingInfo: atom.supportingInfo,
        theoryFiction: atom.theoryFiction,
        parentAtoms: atom.parentAtoms?.map((a: any) => a.id) || [],
      },
    })

    try {
      // Generate a unique ID for Pinecone
      const pineconeId = uuidv4()

      // Format atom content for embedding
      const text = formatSynthesizedAtomForEmbedding(atom)

      // Store in Pinecone
      const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' })
      const index = pc.index('fleet')
      const atomsNamespace = index.namespace('atoms')

      // Create record with text for Pinecone's automatic embedding
      await atomsNamespace.upsertRecords([
        {
          id: pineconeId,
          text,
          // @ts-ignore
          type: 'synthesized',
          title: atom.title,
          content: atom.mainContent,
          payloadAtomId: String(savedAtom.id),
        },
      ])

      // Update the document with the Pinecone ID for future reference
      await payload.update({
        collection: 'synthesizedAtoms',
        id: savedAtom.id,
        data: {
          pineconeId: pineconeId,
        },
      })
    } catch (pineconeError) {
      console.error('Error storing in Pinecone:', pineconeError)
      // Still return success for the Payload creation even if Pinecone fails
    }

    return { success: true, atom: savedAtom }
  } catch (error) {
    console.error('Error saving synthesized atom:', error)
    throw new Error('Failed to save synthesized atom')
  }
}
