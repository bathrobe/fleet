'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { generateAtomsWithLLM } from './atomsPrompt'
import { upsertVectors } from '../vectors/actions'

interface AtomData {
  title: string
  mainContent: string
  supportingInfo: string[]
  supportingQuote: string
  source?: any // Payload ID of the source document
}

/**
 * Process and create atoms from a source document
 */
export async function createAtomsFromSource(
  sourceData: any,
  originalContent: string,
): Promise<any> {
  try {
    // 1. Generate atoms using LLM
    console.log('Generating atoms with LLM...')
    const atomsResult = await generateAtomsWithLLM(sourceData, originalContent)
    console.log('Atoms generated:', atomsResult)
    if (!atomsResult.success) {
      return atomsResult // Return error if LLM generation failed
    }

    // 2. Process the generated atoms
    const atoms = atomsResult.content
    if (!atoms || !Array.isArray(atoms)) {
      return {
        success: false,
        error: 'No valid atoms content returned from LLM',
      }
    }

    // 3. Create the atoms in database
    const payload = await getPayload({ config, importMap: {} })
    const createdAtoms = []

    for (const atom of atoms) {
      try {
        // Prepare atom data with reference to source

        const atomData = {
          ...atom,
          source: sourceData.id, // Link to the source document
        }

        // Create atom in Payload
        const createdAtom = await payload.create({
          collection: 'atoms',
          data: atomData,
        })

        try {
          console.log('Upserting vector for atom:', createdAtom)
          const vectorResult = await upsertVectors(createdAtom)
          console.log(`Vector created for atom: ${createdAtom.id}`, vectorResult)
          // Update the atom with the pineconeId from the vector result
          if (vectorResult && vectorResult.pineconeAtomId) {
            await payload.update({
              collection: 'atoms',
              id: vectorResult.payloadAtomId,
              data: {
                pineconeId: vectorResult.pineconeAtomId,
              },
            })
            console.log(
              `Updated atom ${vectorResult.payloadAtomId} with pineconeId: ${vectorResult.pineconeAtomId}`,
            )
          }
        } catch (vectorError: any) {
          console.error(
            `Failed to create vector for atom ${createdAtom.id}: ${vectorError.message}`,
          )
          // Continue processing other atoms even if vector creation fails
        }
        createdAtoms.push(createdAtom)
      } catch (atomError: any) {
        console.error(`Failed to create atom: ${atomError.message}`, atom)
      }
    }

    return {
      success: true,
      atoms: createdAtoms,
      count: createdAtoms.length,
    }
  } catch (error: any) {
    console.error('Error creating atoms:', error)
    return {
      success: false,
      error: error.message || 'Unknown error creating atoms',
    }
  }
}
