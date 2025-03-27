'use server'

import { getCompletion } from '@/utilities/anthropic'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Pinecone } from '@pinecone-database/pinecone'

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
    // Craft a detailed prompt for the LLM
    const prompt = `
    <instructions>
    I have two concepts that I'd like you to synthesize into a new, original idea.
    Your task is to create a meaningful combination of these concepts that yields 
    a novel insight - not just explaining how synthesis works in general.
    The combination should be specific and detailed, drawing directly from the 
    content of both concepts provided. Use divergent thinking techniques. 
    Don't just combine the concepts, but create something that's more than the sum of its parts.
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
 * Save the synthesized atom to the database
 */
async function saveSynthesizedAtom(atomData: Atom) {
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
        // Convert the mainContent to a vector using Payload's existing mechanism
        // This would typically involve an AI embedding model like OpenAI or Cohere
        // For now, we'll just log that this would happen in a production setting
        console.log('In production, would add the synthesized atom to Pinecone here')

        // If you want to implement vector embedding:
        // 1. Generate an embedding for the atom's content
        // 2. Store it in Pinecone with the atom's ID
        // 3. Update the atom record with the Pinecone ID
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

/**
 * Server action to synthesize two atoms into a new concept
 */
export async function synthesizeAtoms(atom1: Atom, atom2: Atom) {
  if (!atom1 || !atom2) {
    throw new Error('Both atoms are required')
  }

  try {
    // Generate the combined atom content
    const combinedAtom = await generateCombinedAtom(atom1, atom2)

    // Save the combined atom to the database
    const savedAtom = await saveSynthesizedAtom(combinedAtom)

    // Return the combined atom with the database ID
    return {
      combinedAtom: {
        ...combinedAtom,
        id: String(savedAtom.id), // Convert ID to string to match Atom type
      },
    }
  } catch (error) {
    console.error('Error synthesizing atoms:', error)
    throw new Error('Failed to synthesize atoms')
  }
}
