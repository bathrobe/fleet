import { getTwitterClient } from './store'

interface TweetResultData {
  id?: string
  [key: string]: any // Allow other properties
}

/**
 * Post a tweet, optionally as a reply to create a thread
 * @param content The tweet content
 * @param inReplyToId Optional tweet ID to reply to (for creating threads)
 * @returns Object containing the ID of the posted tweet
 */
export const postTweet = async (content: string, inReplyToId?: string): Promise<{ id: string }> => {
  console.log('Attempting to post tweet:', content.substring(0, 50) + '...')
  if (inReplyToId) {
    console.log('As reply to:', inReplyToId)
  }

  const twitter = getTwitterClient()

  try {
    const isDryRun = process.env.TWITTER_DRY_RUN === 'true'

    if (isDryRun) {
      console.log('DRY RUN: Would tweet:', content)
      const mockId = `mock_${Date.now()}`
      console.log(`DRY RUN: Mock tweet ID: ${mockId}`)
      return { id: mockId }
    }

    let response: Response | null = null

    if (inReplyToId) {
      console.log(`Creating thread tweet as reply to ${inReplyToId}`)
      response = (await twitter?.sendTweet?.(content, inReplyToId)) as Response
      console.log('Thread tweet sent successfully as reply')
    } else {
      console.log('Sending new tweet')
      response = (await twitter?.sendTweet?.(content)) as Response
      console.log('Tweet sent successfully')
    }

    if (!response || !response.ok) {
      console.error(
        'Tweet request failed or response was not OK:',
        response?.status,
        response?.statusText,
      )
      throw new Error(
        `Tweet request failed with status: ${response?.status} ${response?.statusText}`,
      )
    }

    let responseData: TweetResultData | null = null
    try {
      responseData = await response.json()
      console.log('Parsed response data from sendTweet:', JSON.stringify(responseData, null, 2))
    } catch (parseError) {
      console.error('Failed to parse JSON response from sendTweet:', parseError)
      throw new Error('Failed to parse tweet response body.')
    }

    const tweetId =
      responseData?.data?.create_tweet?.tweet_results?.result?.rest_id ??
      responseData?.data?.tweet_result?.rest_id ??
      responseData?.rest_id ??
      responseData?.id

    if (tweetId && typeof tweetId === 'string') {
      console.log('Extracted tweet ID from response data:', tweetId)
      return { id: tweetId }
    } else {
      console.error('Failed to extract tweet ID from parsed response data. Data was:', responseData)
      throw new Error('Failed to extract tweet ID from API response structure.')
    }
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.startsWith('Failed to extract tweet ID') ||
        error.message.startsWith('Failed to parse tweet response') ||
        error.message.startsWith('Tweet request failed'))
    ) {
      // Error already logged
    } else {
      console.error('Error during tweet posting process:', error)
    }
    throw error // Re-throw
  }
}
