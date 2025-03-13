'use server'

import { Anthropic } from '@anthropic-ai/sdk'
// This function will take source document data and generate atoms using an LLM
export async function generateAtomsWithLLM(
  sourceData: any,
  originalContent: string, // The original content/text that was submitted
): Promise<any> {
  try {
    // 1. Build the prompt for the LLM
    const prompt = buildAtomsPrompt(sourceData, originalContent)

    // 2. Call the Anthropic API
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    })

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 8192,
      temperature: 0.5,
      system:
        'You are an expert researcher who distills complex information into clear, concise atomic ideas. You must only return valid, parseable JSON with no explanatory text before or after.',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    // 3. Extract and parse the JSON response
    // @ts-ignore
    const content = response.content[0].text

    try {
      // Parse JSON from the response
      const parsedContent = JSON.parse(content)
      return {
        success: true,
        content: parsedContent.content || parsedContent,
      }
    } catch (parseError) {
      console.error('Failed to parse LLM response as JSON:', parseError)
      return {
        success: false,
        error: 'The LLM response was not valid JSON',
        rawContent: content,
      }
    }
  } catch (error: any) {
    console.error('Error generating atoms:', error)
    return {
      success: false,
      error: error.message || 'Unknown error generating atoms',
    }
  }
}

// Helper function to build the prompt
function buildAtomsPrompt(sourceData: any, originalContent: string): string {
  return `
You are an expert at distilling complex information into readable, simple-but-insightful atomic concepts.

SOURCE DOCUMENT:
Title: ${sourceData.title}
URL: ${sourceData.url}
${sourceData.oneSentenceSummary ? `One Sentence Summary: ${sourceData.oneSentenceSummary}` : ''}
${sourceData.mainPoints ? `Main Points: ${sourceData.mainPoints}` : ''}

ORIGINAL CONTENT:
${originalContent}

TASK:
Create 3-5 "atoms" from this source. Each atom should capture a single, stand-alone insight or idea, backed up with a direct quote.

FORMAT:
Respond with a JSON array of atoms. Each atom should have:
- title: A concise, descriptive, evocative title (4-8 words)
- mainContent: The full atomic idea (1-2 sentences)
- supportingInfo: An array of 2-4 bullet points supporting the main idea (Remember all of these are complete sentences)
- supportingQuote: A quote from the Source that supports the main idea. 1-3 sentences, verbatim from source.

IMPORTANT: Respond ONLY with the JSON object, nothing else. No explanations, prefaces or conclusions.

Example format:
{
  "content": [
    {
      "title": "Example Atom Title",
      "mainContent": "This is what an atom looks like. It contains a single, coherent idea.",
      "supportingInfo": "- First bullet point\n- Second bullet point\n- Third bullet point (Remember all of these are complete sentences)",
      "supportingQuote": "This is what a supporting quote looks like. It contains a quote from the source that supports the main idea."
    }
      // ... more atoms
  ]
}
`
}
