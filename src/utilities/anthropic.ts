import Anthropic from '@anthropic-ai/sdk'

const defaultConfig = {
  model: 'claude-3-5-sonnet-20241022',
  temperature: 0.9,
  maxTokens: 1000,
}

export const getCompletion = async (
  prompt: string,
  apiKey: string,
  configOverride: any = {},
): Promise<{
  content: string
  model: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}> => {
  const client = new Anthropic({
    apiKey,
  })

  const cfg = { ...defaultConfig, ...configOverride }

  try {
    const response = await client.messages.create({
      model: cfg.model,
      max_tokens: cfg.maxTokens,
      temperature: cfg.temperature,
      messages: [{ role: 'user', content: prompt }],
    })

    const textContent = response.content[0]
    if (textContent.type !== 'text') {
      throw new Error('Expected text response from Claude')
    }

    return {
      content: textContent.text,
      model: cfg.model,
      usage: {
        promptTokens: response.usage?.input_tokens || 0,
        completionTokens: response.usage?.output_tokens || 0,
        totalTokens: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0),
      },
    }
  } catch (error) {
    console.error('Error in Anthropic completion:', error)
    throw error
  }
}
