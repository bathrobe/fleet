'use server'

import { processSourceWithLLM } from './sourcePrompt'

// Server action wrapper with state management
export async function processSourceAction(prevState: any, formData: FormData) {
  try {
    const content = formData.get('content')
    if (!content) {
      return { ...prevState, error: 'No content provided', processed: true }
    }

    const result = await processSourceWithLLM(
      content.toString(),
      process.env.ANTHROPIC_API_KEY || '',
    )
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
