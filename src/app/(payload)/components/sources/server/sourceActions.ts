'use server'

// Import Anthropic directly here - no shared utility
import { Anthropic } from '@anthropic-ai/sdk'

// Parse LLM response into structured data
function parseResponse(response: string) {
  const summaryMatch = response.match(/Summary:(.*?)(?=Tags:|$)/s)
  const tagsMatch = response.match(/Tags:(.*?)(?=Key Insights:|$)/s)
  const insightsMatch = response.match(/Key Insights:(.*?)$/s)

  return {
    summary: summaryMatch ? summaryMatch[1].trim() : '',
    tags: tagsMatch
      ? tagsMatch[1]
          .trim()
          .split(',')
          .map((tag) => tag.trim())
      : [],
    insights: insightsMatch
      ? insightsMatch[1]
          .trim()
          .split('-')
          .filter((item) => item.trim().length > 0)
          .map((item) => item.trim())
      : [],
    rawResponse: response,
  }
}

// Process content with Claude
async function processWithClaude(content: string) {
  const prompt = `
You are an expert research assistant helping to analyze and extract information from documents.

Please analyze the following content and provide:
1. A concise summary (2-3 sentences)
2. 3-5 relevant tags
3. 3-5 key insights or takeaways

Document:
${content}

Format your response as follows:
Summary: [your summary here]
Tags: [comma-separated list of tags]
Key Insights:
- [first insight]
- [second insight]
- [etc.]
`

  // Create the Anthropic client here inside the server action
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
  })

  // Make the API call directly here
  const response = await client.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  })

  return response.content[0].text
}

// Main server action exported for form handling
export async function processSourceAction(prevState: any, formData: FormData) {
  try {
    const content = formData.get('content')
    if (!content) {
      return { ...prevState, error: 'No content provided', processed: true }
    }

    const responseText = await processWithClaude(content.toString())
    const result = parseResponse(responseText)

    return {
      result,
      error: null,
      processed: true,
    }
  } catch (error: any) {
    console.error('Error processing source:', error)
    return {
      result: null,
      error: error.message || 'An error occurred while processing the content',
      processed: true,
    }
  }
}
