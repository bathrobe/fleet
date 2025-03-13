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
        'You are an expert researcher who distills complex information into clear, concise atomic ideas. You must only return valid, parseable JSON with no explanatory text before or after. Never include comments in the JSON. Ensure all quotes and special characters are properly escaped.',
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
      // Sanitize the content to ensure it's valid JSON
      const sanitizedContent = sanitizeJsonString(content)

      // Parse JSON from the response
      const parsedContent = JSON.parse(sanitizedContent)
      return {
        success: true,
        content: parsedContent.content || parsedContent,
      }
    } catch (parseError) {
      console.error('Failed to parse LLM response as JSON:', parseError)
      // Attempt recovery with a more aggressive sanitization
      try {
        const aggressiveSanitized = extractJsonObject(content)
        const parsedContent = JSON.parse(aggressiveSanitized)
        return {
          success: true,
          content: parsedContent.content || parsedContent,
          warning: 'JSON required recovery sanitization',
        }
      } catch (secondError) {
        console.error('Secondary JSON parsing failed:', secondError)
        return {
          success: false,
          error: 'The LLM response was not valid JSON',
          rawContent: content,
        }
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

// Helper functions to sanitize JSON strings
function sanitizeJsonString(jsonString: string): string {
  // Trim whitespace and ensure we're only processing the JSON part
  let cleaned = jsonString.trim()

  // Remove any markdown code block markers
  cleaned = cleaned.replace(/```json\s*|\s*```/g, '')

  // Remove any non-JSON text before or after the JSON object
  const firstBrace = cleaned.indexOf('{')
  const lastBrace = cleaned.lastIndexOf('}')

  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1)
  }

  // Remove any comments that may be present in the JSON
  cleaned = cleaned.replace(/\/\/.*$/gm, '')

  return cleaned
}

// More aggressive JSON extraction for recovery
function extractJsonObject(text: string): string {
  const regex = /\{(?:[^{}]|(?:\{(?:[^{}]|(?:\{[^{}]*\}))*\}))*\}/g
  const matches = text.match(regex)

  if (matches && matches.length > 0) {
    return matches[0]
  }

  throw new Error('No valid JSON object found in the text')
}

// Helper function to build the prompt
function buildAtomsPrompt(sourceData: any, originalContent: string): string {
  return `
You are an expert at distilling complex information into readable, simple-but-insightful atomic concepts.

SOURCE DOCUMENT:
Title: ${sourceData.title || 'Untitled'}
URL: ${sourceData.url || 'No URL provided'}
${sourceData.oneSentenceSummary ? `One Sentence Summary: ${sourceData.oneSentenceSummary}` : ''}
${sourceData.mainPoints ? `Main Points: ${sourceData.mainPoints}` : ''}

ORIGINAL CONTENT:
${originalContent}

TASK:
Create 3-5 "atoms" from this source. Each atom should capture a single, stand-alone insight or idea, backed up with a direct quote.

FORMAT REQUIREMENTS:
1. Respond with ONLY a JSON object
2. Do not include any text before or after the JSON
3. Do not include any comments within the JSON
4. Ensure all quotes and special characters are properly escaped
5. The JSON must be valid and parseable

The JSON should have this structure:
{
  "content": [
    {
      "title": "A concise, descriptive title (4-8 words)",
      "mainContent": "A single, coherent idea that stands on its own (1-2 sentences)",
      "supportingInfo": "- First supporting point as a complete sentence.\\n- Second supporting point as a complete sentence.\\n- Third supporting point as a complete sentence.",
      "supportingQuote": "A direct quote from the source that supports the main idea (2-3 sentences, verbatim)."
    },
    {
      "title": "Second Atom Title",
      "mainContent": "Second atom main content.",
      "supportingInfo": "- Supporting point one.\\n- Supporting point two.\\n- Supporting point three.",
      "supportingQuote": "Supporting quote for second atom."
    }
  ]
}

IMPORTANT: Your response must be valid, parseable JSON with no other text.
`
}
