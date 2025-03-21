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
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8192,
      temperature: 0.7,
      system: `You're a note-taker that always writes in readable, eighth-grade level prose in an active voice and with sparkling, evocative language.
You combine technical rigor with a sense of deep wonder and divergent thinking, and excel at expressing complex thoughts in very simple, approachable prose. 
Your ideas should help spark new ideas and research questions, and you should be able to write them in a way that is accessible to a wide audience.
You must only return valid, parseable JSON with no explanatory text before or after. Never include comments in the JSON. Ensure all quotes and special characters are properly escaped.`,
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
Pick out 3-5 important/interesting atomic concepts that would be relevant for people researching governance futurism, network states and building a new form of government.
These should be singular, atomic notes that contain an interesting idea that could be built upon in creating our own unique content in our zettelkasten.
Each atom should capture a single, stand-alone insight that could be built upon for creating unique content. The ideas should be original, non-obvious, and thought-provoking.
The goal is to extract the kinds of ideas that could spark curiosity, wonder, and the generation of new ideas and research questions.
Each should be able to stand on its own without being in the context of the other points or the source (i.e., it makes sense on its own.)

FORMAT REQUIREMENTS:
1. Respond with ONLY a JSON object
2. Do not include any text before or after the JSON
3. Do not include any comments within the JSON
4. Ensure all quotes and special characters are properly escaped
5. The JSON must be valid and parseable
6. Each atom should have an evocative, original title in title case and expressing the main idea (max 5 words)
7. Include a direct supporting quote from the source, 2-3 sentences verbatim. The quote should stand on its own, providing all the context needed to understand how it supports the main idea
8. Express the main point in a single clear sentence at eighth-grade reading level. Make SURE it can be understood without any surrounding context, and does not need the source's topic or any other atoms to be understood.
9. Include 3-4 supporting points as complete sentences in an array of objects with a text property

The JSON should have this structure:
{
  "content": [
    {
      "title": "An evocative, original title (Max 5 words)",
      "mainContent": "Single complete sentence expressing the point--readable, eighth grade level, clear, while containing a spark that could provoke new ideas.",
      "supportingInfo": [{text: "Complete sentences supporting the point with extra information."}, {text: "Two or three of these, fleshing out the concept."}, {text: "Vary the number of text elements in each atom across the source."}],
      "supportingQuote": "A direct quote from the source that supports the main idea (1-3 sentences, verbatim). The quote should stand on its own, providing all the context needed to understand how it supports the main idea. If you need ellipses to explain proper nouns from other areas in the text, do so!"
    },
    {
      "title": "Second atom title",
      "mainContent": "Second atom main content.",
      "supportingInfo": [{text: "Supporting point one."}, {text: "Supporting point two."}, {text: "Supporting point three."}],
      "supportingQuote": "Supporting quote for second atom."
    }
  ]
}

IMPORTANT: Your response must be valid, parseable JSON with no other text.
`
}
