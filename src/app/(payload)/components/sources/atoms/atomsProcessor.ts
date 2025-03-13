'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { generateAtomsWithLLM } from './atomsPrompt'

interface AtomData {
  title: string
  mainContent: string
  supportingInfo: string[]
  supportingQuote: string
  source?: string // Payload ID of the source document
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
    console.log('Generating atoms with LLM for source:', sourceData.id)
    const atomsResult = await generateAtomsWithLLM(sourceData, originalContent)
    console.log(
      'Atoms generated for source',
      sourceData.id,
      atomsResult.success ? 'successfully' : 'with errors',
    )

    if (!atomsResult.success) {
      console.error('LLM atoms generation failed:', atomsResult.error)
      return atomsResult // Return error if LLM generation failed
    }

    // 2. Process the generated atoms
    const atoms = atomsResult.content
    if (!atoms || !Array.isArray(atoms)) {
      console.error('No valid atoms content returned from LLM')
      return {
        success: false,
        error: 'No valid atoms content returned from LLM',
      }
    }

    // 3. Create the atoms in database
    const payload = await getPayload({ config, importMap: {} })
    const createdAtoms = []

    // Log the number of atoms to be created
    console.log(`Creating ${atoms.length} atoms for source ${sourceData.id}`)

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

        console.log(`Created atom ${createdAtom.id} for source ${sourceData.id}`)
        createdAtoms.push(createdAtom)
      } catch (atomError: any) {
        console.error(`Failed to create atom for source ${sourceData.id}:`, atomError.message, atom)
      }
    }

    console.log(`Successfully created ${createdAtoms.length} atoms for source ${sourceData.id}`)
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
