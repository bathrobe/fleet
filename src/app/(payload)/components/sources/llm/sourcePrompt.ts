import { getCompletion } from '../../../../../utilities/anthropic'

/**
 * Process source content through Claude to extract insights
 */
export const processSourceWithLLM = async (content: string, apiKey: string): Promise<any> => {
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

  try {
    const response = await getCompletion(prompt, apiKey)
    return response
  } catch (error) {
    console.error('Error processing source with LLM:', error)
  }
}
