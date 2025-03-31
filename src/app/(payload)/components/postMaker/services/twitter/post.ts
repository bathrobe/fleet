import { getTwitterClient } from './store'

interface TweetResult {
  id: string
  [key: string]: any
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

    let tweetId: string | null = null

    if (inReplyToId) {
      // For reply-based thread tweets
      console.log(`Creating thread tweet as reply to ${inReplyToId}`)

      // Send the tweet as a reply without adding username mention
      const result = (await twitter.sendTweet(content, inReplyToId)) as unknown as TweetResult
      console.log('Thread tweet sent successfully as reply')

      // Check if result has ID
      if (result && typeof result === 'object' && 'id' in result) {
        tweetId = result.id
      }
    } else {
      console.log('Sending new tweet')
      const result = (await twitter.sendTweet(content)) as unknown as TweetResult
      console.log('Tweet sent successfully')

      // Check if result has ID
      if (result && typeof result === 'object' && 'id' in result) {
        tweetId = result.id
      }
    }

    // If we got an ID directly, return it
    if (tweetId) {
      console.log('Got tweet ID directly:', tweetId)
      return { id: tweetId }
    }

    // Otherwise, get the latest tweet to get its ID
    const username = process.env.TWITTER_USERNAME
    if (!username) {
      throw new Error('Twitter username not found in environment variables')
    }

    console.log('Fetching latest tweet to get ID')
    const latestTweet = await twitter.getLatestTweet(username as string)

    if (!latestTweet) {
      console.error('Failed to get tweet ID after posting')
      throw new Error('Failed to get tweet ID after posting')
    }

    console.log('Successfully got tweet ID:', latestTweet.id)
    return { id: latestTweet.id as string }
  } catch (error) {
    console.error('Error posting tweet:', error)
    throw error
  }
}
