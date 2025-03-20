'use server'
import { getCompletion } from '../../../../../utilities/anthropic'

export const processSourceWithLLM = async (content: string, apiKey: string): Promise<any> => {
  const prompt = `
<Instructions>
Output a markdown artifact with the following fields:

#### Summary 
One sentence summary here. The summary should only be one complete sentence and should be concise and readable. 

#### Main points 
- Here you should put 2-5 main points outlining the key ideas in the transcript 
- Each bullet should be a complete sentence. 
- Each main point should stand on its own. 

#### Bullet summary 
- This is a more indepth summary of the transcript that covers everything in it using a bullet list of 8-12 bullets. 
- These should also be complete sentences. 
- Be sure to cover anything important that was missed by the preceding two sections. 

#### People, Places, and Things 
List a maximum of 6 proper nouns mentioned in the transcript that would be worth knowing about. Do so in this format:

Name of proper noun - 1-2 sentences explanation of the entity 

Next one - etc.

#### Interesting Details 
- Include a maximum of 6 interesting bits of trivia, asides, anecdotes, apocrypha, etc. that have not been picked up in previous sections 

#### Quotations
If any of the figures in the transcipt (besides the lecturer) have a unique or memorable quotation, deposit it here with attribution in markdown blockquote format (> quote \n - Attribution)
If there are none, write "None."

***
Stylistically, be sure to write all this prose at an eighth grade reading level and avoid run on sentences.

Note: Any frontmatter metadata (like title, url, author, date) may have already been extracted from the content, so focus on analyzing the main text content only.
</Instructions>

<Format>
Structure your output in valid JSON in the following format:
{
  "oneSentenceSummary": "string - One sentence summary here. The summary should only be one complete sentence and should be concise and readable.",
  "mainPoints": "string - 2-5 main points outlining the key ideas in the transcript",
  "bulletSummary": "string - More indepth summary of the transcript that covers everything in it using a bullet list of 8-12 bullets.",
  "peopleplacesthingsevents": "string - List of 1-6 proper nouns mentioned in the transcript that would be worth knowing about.",
  "details": "string - 2-4 interesting bits of trivia, asides, anecdotes, apocrypha, etc. that have not been picked up in previous sections",
  "quotations": "string - Any unique or memorable quotations from figures in the transcript with attribution. If there are none, write 'None.'"
}

IMPORTANT JSON FORMATTING REQUIREMENTS:
1. Your response must be valid, parseable JSON with no other text before or after
2. Do not include any non-JSON comments
3. All field names must match EXACTLY as shown above (camelCase, no spaces)
4. Ensure all quotes and special characters are properly escaped
5. All fields are REQUIRED - never leave any fields empty
6. Each field should contain appropriate content based on your analysis
</Format>

<Content>
${content}
</Content>

</Output>`

  try {
    const response = await getCompletion(prompt, apiKey, {
      system:
        'You are an expert researcher who distills complex information into clear, concise summaries. You must only return valid, parseable JSON with no explanatory text before or after. Ensure all quotes and special characters are properly escaped.',
    })

    try {
      // Sanitize the response content to ensure it's valid JSON
      const sanitizedContent = sanitizeJsonString(response.content)

      // Parse JSON from the sanitized response
      const parsedContent = JSON.parse(sanitizedContent)
      return parsedContent
    } catch (parseError) {
      console.error('Failed to parse LLM response as JSON:', parseError)

      // Attempt recovery with a more aggressive sanitization
      try {
        const aggressiveSanitized = extractJsonObject(response.content)
        const parsedContent = JSON.parse(aggressiveSanitized)
        return parsedContent
      } catch (secondError) {
        console.error('Secondary JSON parsing failed:', secondError)
        throw new Error('Could not parse LLM response as valid JSON')
      }
    }
  } catch (error) {
    console.error('Error processing source with LLM:', error)
    throw error
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
