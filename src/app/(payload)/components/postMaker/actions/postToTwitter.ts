'use server'

import type { Payload } from 'payload'
import { getPayload } from 'payload'
import payloadConfig from '../../../../../payload.config'
import { initTwitter } from '../services/twitter/initialize'
import { postTweet } from '../services/twitter/post'
import type { GeneratedPost } from '../types'

export const postToTwitter = async (
  post: GeneratedPost,
): Promise<{ success: boolean; tweetIds: string[] }> => {
  console.log('Starting Twitter post process')
  try {
    console.log('Getting Payload client for Twitter init...')
    const payload = await getPayload({ config: payloadConfig })
    console.log('Payload client obtained.')

    console.log('Initializing Twitter client with Payload instance...')
    await initTwitter(payload)
    console.log('Twitter client initialized.')

    const mainTweets = post.content.filter((tweet) => !tweet.isSourceTweet)
    const sourceTweet = post.content.find((tweet) => tweet.isSourceTweet)

    console.log(
      `Found ${mainTweets.length} main tweets and ${sourceTweet ? '1' : '0'} source tweet`,
    )

    const tweetIds: string[] = []
    let lastTweetId: string | undefined = undefined

    if (mainTweets.length > 0) {
      console.log('Posting first tweet of thread')
      const firstTweetResult = await postTweet(mainTweets[0].text)
      tweetIds.push(firstTweetResult.id)
      lastTweetId = firstTweetResult.id

      for (let i = 1; i < mainTweets.length; i++) {
        console.log(`Posting tweet ${i + 1}/${mainTweets.length} in thread`)
        const result = await postTweet(mainTweets[i].text, lastTweetId)
        tweetIds.push(result.id)
        lastTweetId = result.id
      }
    }

    if (sourceTweet) {
      console.log('Posting source tweet')
      const result = await postTweet(sourceTweet.text, lastTweetId)
      tweetIds.push(result.id)
    }

    console.log('Successfully posted all tweets')
    return { success: true, tweetIds }
  } catch (error) {
    console.error('Error posting to Twitter:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during posting'
    console.error(`Posting Action Failed: ${errorMessage}`)
    return { success: false, tweetIds: [] }
  }
}
