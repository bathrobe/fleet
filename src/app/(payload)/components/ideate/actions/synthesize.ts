'use server'

import { getCompletion } from '@/utilities/anthropic'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Pinecone } from '@pinecone-database/pinecone'
import { upsertSynthesizedAtomVectors } from '@/app/(payload)/components/sources/vectors/actions'

// Define the Atom type based on what's needed in this context
export type Atom = {
  id: string
  title?: string
  mainContent: string
  supportingQuote?: string
  supportingInfo?: { text: string }[]
  theoryFiction?: string
  parentAtoms?: { id: string; pineconeId?: string }[]
  source?: { id: string; title?: string }
  pineconeId?: string
}

/**
 * Generate a combined atom from two source atoms using Claude
 */
async function generateCombinedAtom(atom1: Atom, atom2: Atom): Promise<Atom> {
  try {
    // Fetch additional source information for both atoms
    const payload = await getPayload({ config })

    // Get source details for atom1
    let source1Details = {}
    if (atom1.source?.id) {
      try {
        const source1 = await payload.findByID({
          collection: 'sources',
          id: atom1.source.id,
        })
        source1Details = {
          title: source1.title || 'Unknown Source',
          bulletSummary: source1.bulletSummary || [],
          author: source1.author || 'Unknown Author',
        }
      } catch (error) {
        console.error('Error fetching source for atom1:', error)
      }
    }

    // Get source details for atom2
    let source2Details = {}
    if (atom2.source?.id) {
      try {
        const source2 = await payload.findByID({
          collection: 'sources',
          id: atom2.source.id,
        })
        source2Details = {
          title: source2.title || 'Unknown Source',
          bulletSummary: source2.bulletSummary || [],
          author: source2.author || 'Unknown Author',
        }
      } catch (error) {
        console.error('Error fetching source for atom2:', error)
      }
    }

    // Craft a detailed prompt for the LLM
    const prompt = `
    <instructions>
    I have two concepts that I'd like you to synthesize into a new, original idea.
    Your task is to create a meaningful combination of these concepts that yields 
    a novel insight - not just explaining how synthesis works in general.
    The combination should be specific and detailed, drawing directly from the 
    content of both concepts provided. Use divergent thinking techniques. 
    Don't just combine the concepts, but create something that's more than the sum of its parts.
    Draw from each concepts, all of their supporting information, and the sources.
    Try to make the idea genuinely novel and surprising.
    </instructions>

    <concept1>
    Title: ${atom1.title || 'Untitled'}
    Main Content: ${atom1.mainContent}
    ${atom1.supportingQuote ? `Supporting Quote: ${atom1.supportingQuote}` : ''}
    ${
      atom1.supportingInfo?.length
        ? `
    Supporting Information:
    ${atom1.supportingInfo.map((info) => `- ${info.text}`).join('\n')}
    `
        : ''
    }
    ${
      source1Details && (source1Details as any).title
        ? `
    Source: ${(source1Details as any).title} by ${(source1Details as any).author || 'Unknown Author'}
    ${
      (source1Details as any).bulletSummary?.length
        ? `
    Source Summary:
    ${(source1Details as any).bulletSummary.map((bullet: any) => `- ${bullet.text}`).join('\n')}
    `
        : ''
    }
    `
        : ''
    }
    </concept1>

    <concept2>
    Title: ${atom2.title || 'Untitled'}
    Main Content: ${atom2.mainContent}
    ${atom2.supportingQuote ? `Supporting Quote: ${atom2.supportingQuote}` : ''}
    ${
      atom2.supportingInfo?.length
        ? `
    Supporting Information:
    ${atom2.supportingInfo.map((info) => `- ${info.text}`).join('\n')}
    `
        : ''
    }
    ${
      source2Details && (source2Details as any).title
        ? `
    Source: ${(source2Details as any).title} by ${(source2Details as any).author || 'Unknown Author'}
    ${
      (source2Details as any).bulletSummary?.length
        ? `
    Source Summary:
    ${(source2Details as any).bulletSummary.map((bullet: any) => `- ${bullet.text}`).join('\n')}
    `
        : ''
    }
    `
        : ''
    }
    </concept2>

    <output_format>
    Respond ONLY with a JSON object with these exact fields:
    - title: A catchy, brief title for the new concept (5 words max)
    - mainContent: One or two substantive sentences that clearly express the new synthesized concept
    - supportingInfo: An array of 2-3 objects with a "text" field containing bullet points that elaborate on the concept's implications
    - theoryFiction: A short paragraph, styled as a fictional quote, that imagines a future where the concept is realized.

    Ensure your response is properly formatted JSON. Do not include markdown code blocks or any text before or after the JSON.
    
    Example format:
    {
      "title": "Concise Meaningful Title",
      "mainContent": "A substantive sentence that expresses a new idea combining elements from both concepts in a novel way.",
      "theoryFiction": "A short paragraph, styled as a fictional quote, that imagines a future where the concept is realized.",
      "supportingInfo": [
        {"text": "First supporting point that elaborates on the concept."},
        {"text": "Second supporting point that discusses implications."},
        {"text": "Third supporting point that suggests applications."}
      ]
    }
    </output_format>
    `

    // Get the API key from environment variables
    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set in environment variables')
    }

    // Call the Anthropic API using our utility function
    const response = await getCompletion(prompt, apiKey, {
      temperature: 0.8, // Slightly creative but still focused
      maxTokens: 1000, // Should be plenty for our response
    })

    // Parse the response as JSON
    let parsedResponse
    try {
      parsedResponse = JSON.parse(response.content)

      // Validate the response has all required fields
      if (!parsedResponse.title || !parsedResponse.mainContent || !parsedResponse.supportingInfo) {
        throw new Error('Response missing required fields')
      }
    } catch (parseError) {
      console.error('Failed to parse LLM response as JSON:', parseError)
      console.log('Raw response:', response.content)

      // Fallback to a simple object if parsing fails
      parsedResponse = {
        title: `Synthesized Concept`,
        mainContent: response.content.substring(0, 200) + '...',
        theoryFiction: 'Error parsing complete response',
        supportingInfo: [{ text: "The LLM response couldn't be properly parsed as JSON." }],
      }
    }

    // Return the generated atom with an ID and parent atom IDs
    return {
      id: 'generated-' + Date.now(),
      parentAtoms: [{ id: atom1.id }, { id: atom2.id }],
      ...parsedResponse,
    }
  } catch (error) {
    console.error('Error generating combined atom:', error)
    throw new Error('Failed to generate combined atom')
  }
}

/**
 * Server action to synthesize two atoms into a new concept
 * but does NOT save to database automatically
 */
export async function synthesizeAtoms(atom1: Atom, atom2: Atom) {
  if (!atom1 || !atom2) {
    throw new Error('Both atoms are required')
  }

  try {
    // Generate the combined atom content
    const combinedAtom = await generateCombinedAtom(atom1, atom2)

    // Return the combined atom without saving
    return {
      combinedAtom: {
        ...combinedAtom,
      },
    }
  } catch (error) {
    console.error('Error synthesizing atoms:', error)
    throw new Error('Failed to synthesize atoms')
  }
}

/**
 * Server action to save a synthesized atom to the database
 */
export async function saveSynthesizedAtom(atomData: Atom) {
  try {
    const payload = await getPayload({ config })

    // Extract relevant data for creating the synthesized atom
    const { title, mainContent, supportingInfo, theoryFiction, parentAtoms } = atomData

    // Prepare parent atom IDs - Payload relationship fields expect an array of IDs
    const parentAtomIds = parentAtoms ? parentAtoms.map((parent) => parent.id) : []

    // Create the synthesized atom in the database
    const createdAtom = await payload.create({
      collection: 'synthesizedAtoms',
      data: {
        title: title || 'Synthesized Concept',
        mainContent,
        supportingInfo,
        theoryFiction,
        // Use type assertion to tell TypeScript this is the correct type
        // @ts-ignore - Payload expects string[] for relationship fields
        parentAtoms: parentAtomIds,
      },
    })

    // Check if we need to update Pinecone index
    if (process.env.PINECONE_API_KEY) {
      try {
        // Format the atom data for vector embedding
        const atomForVector = {
          id: createdAtom.id,
          title: createdAtom.title,
          mainContent: createdAtom.mainContent,
          supportingInfo: createdAtom.supportingInfo,
          theoryFiction: createdAtom.theoryFiction,
          // Include parent atoms for vector context
          parentAtoms: parentAtomIds.map((id) => ({ id })),
        }

        // Use the vector utility to create the embedding and store in Pinecone
        // Pass the atom ID explicitly to ensure it updates the existing atom
        const vectorResult = await upsertSynthesizedAtomVectors(atomForVector)

        if (vectorResult && vectorResult.pineconeAtomId) {
          // Update the atom with the pineconeId
          await payload.update({
            collection: 'synthesizedAtoms',
            id: createdAtom.id,
            data: {
              pineconeId: vectorResult.pineconeAtomId,
            },
          })

          console.log(
            `Successfully added vector for synthesized atom ${createdAtom.id} with pineconeId: ${vectorResult.pineconeAtomId}`,
          )

          // Update the return object with the pineconeId
          createdAtom.pineconeId = vectorResult.pineconeAtomId
        }
      } catch (vectorError) {
        console.error('Error updating vector database:', vectorError)
        // We continue even if vector update fails
      }
    }

    return createdAtom
  } catch (error) {
    console.error('Error saving synthesized atom:', error)
    throw new Error('Failed to save synthesized atom')
  }
}
