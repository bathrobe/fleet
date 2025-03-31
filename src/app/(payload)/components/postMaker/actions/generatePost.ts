'use server'

import type { Payload } from 'payload'
import { getCompletion } from '../../../../../utilities/anthropic'
import { createPostPrompt } from '../utils/createPrompt'
import type { SynthesizedAtom, GeneratedPost } from '../types'
import payloadConfig from '../../../../../payload.config'
import { createSourceTweet } from '../utils/createSourceTweet'

// Function that takes a payload instance
export async function generatePostWithPayload(
  payloadInstance: Payload,
  atom: SynthesizedAtom,
): Promise<GeneratedPost> {
  try {
    // 1. Fetch the agent global data using Local API
    const agent = await payloadInstance.findGlobal({
      slug: 'agent',
      depth: 0,
      overrideAccess: true,
    })

    if (!agent) {
      throw new Error('Agent settings not found')
    }

    const agentData = {
      bio: agent.bio || '',
      styles: agent.styles || '',
    }

    console.log('Agent data retrieved:', {
      bioLength: agentData.bio.length,
      stylesLength: agentData.styles.length,
    })

    // 2. Create the XML-style prompt
    const prompt = createPostPrompt(atom, agentData.bio, agentData.styles)

    console.log('Prompt created, sending to Anthropic')

    // 3. Get API key from environment
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not found in environment variables')
    }

    console.log('Prompt:', prompt)
    // 4. Call Anthropic with higher temperature for creativity
    const response = await getCompletion(prompt, apiKey, {
      temperature: 0.8,
      maxTokens: 1000,
    })

    console.log('Received response from Anthropic')

    // 5. Parse the JSON response
    try {
      // The response should be a JSON array of tweet objects
      const parsedContent = JSON.parse(response.content)

      if (!Array.isArray(parsedContent)) {
        throw new Error('Expected array of tweets in response')
      }

      // Generate the source tweet
      const sourceTweet = createSourceTweet(atom)

      // Add source tweet to content array
      const contentWithSource = [...parsedContent, { text: sourceTweet, isSourceTweet: true }]

      // 6. Return formatted tweets with usage data
      return {
        content: contentWithSource,
        usage: response.usage,
        model: response.model,
      }
    } catch (parseError: any) {
      console.error('Error parsing LLM response as JSON:', parseError)
      console.log('Raw response:', response.content)
      throw new Error(`Failed to parse response as JSON: ${parseError.message}`)
    }
  } catch (error: any) {
    console.error('Error generating post:', error)
    throw error
  }
}

// Public function that gets the payload instance
export async function generatePost(atom: SynthesizedAtom): Promise<GeneratedPost> {
  try {
    // Import dynamically to prevent Next.js build issues
    const { getPayload } = await import('payload')
    // @ts-ignore (if needed for type issues)
    const payloadInstance = await getPayload({ config: payloadConfig })

    return generatePostWithPayload(payloadInstance, atom)
  } catch (error: any) {
    console.error('Error initializing payload or generating post:', error.message)
    throw error
  }
}
