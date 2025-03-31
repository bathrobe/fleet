'use server'

import { initTwitter } from '../services/twitter/initialize'
import { postTweet } from '../services/twitter/post'
import type { GeneratedPost } from '../types'

export const postToTwitter = async (
  post: GeneratedPost,
): Promise<{ success: boolean; tweetIds: string[] }> => {
  console.log('Starting Twitter post process')
  try {
    // Initialize Twitter client
    console.log('Initializing Twitter client')
    await initTwitter()

    // Post tweets in a thread (except source tweet)
    const mainTweets = post.content.filter((tweet) => !tweet.isSourceTweet)
    const sourceTweet = post.content.find((tweet) => tweet.isSourceTweet)

    console.log(
      `Found ${mainTweets.length} main tweets and ${sourceTweet ? '1' : '0'} source tweet`,
    )

    const tweetIds: string[] = []
    let lastTweetId: string | undefined = undefined

    // Post the first tweet of the thread
    if (mainTweets.length > 0) {
      console.log('Posting first tweet of thread')
      const firstTweetResult = await postTweet(mainTweets[0].text)
      tweetIds.push(firstTweetResult.id)
      lastTweetId = firstTweetResult.id

      // Post the rest of the tweets in the thread as replies
      for (let i = 1; i < mainTweets.length; i++) {
        console.log(`Posting tweet ${i + 1}/${mainTweets.length} in thread`)
        // Use the previous tweet ID to create a thread
        const result = await postTweet(mainTweets[i].text, lastTweetId)
        tweetIds.push(result.id)
        lastTweetId = result.id
      }
    }

    // Post source tweet as a reply to the last main tweet
    if (sourceTweet) {
      console.log('Posting source tweet')
      const result = await postTweet(sourceTweet.text, lastTweetId)
      tweetIds.push(result.id)
    }

    console.log('Successfully posted all tweets')
    return { success: true, tweetIds }
  } catch (error) {
    console.error('Error posting to Twitter:', error)
    return { success: false, tweetIds: [] }
  }
}
