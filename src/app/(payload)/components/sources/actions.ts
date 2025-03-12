'use server'

import { Anthropic } from '@anthropic-ai/sdk'

// Process content with Claude and return raw response
async function processWithClaude(content: string): Promise<string> {
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

  // Create the Anthropic client directly in the server action
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
  })

  // Make the API call
  const response = await client.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  })

  // Check the type of content block and handle appropriately
  if (response.content[0].type === 'text') {
    return response.content[0].text
  } else {
    throw new Error('Unexpected response format from Claude')
  }
}

// Main server action exported for form handling
export async function processSourceAction(prevState: any, formData: FormData) {
  try {
    const content = formData.get('content')
    if (!content) {
      return { ...prevState, error: 'No content provided', processed: true }
    }

    const result = await processWithClaude(content.toString())
    return {
      result,
      error: null,
      processed: true,
    }
  } catch (error: any) {
    return {
      result: null,
      error: error.message || 'An error occurred while processing the content',
      processed: true,
    }
  }
}
