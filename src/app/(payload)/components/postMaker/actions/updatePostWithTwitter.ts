'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export const updatePostWithTwitterInfo = async (
  postId: string,
  tweetId: string,
  tweetUrl: string,
): Promise<void> => {
  try {
    const payload = await getPayload({ config })

    await payload.update({
      collection: 'posts',
      id: postId,
      data: {
        twitterPost: {
          posted: true,
          postId: tweetId,
          url: tweetUrl,
        },
      },
    })

    console.log(`Updated post ${postId} with Twitter info: ${tweetId}, ${tweetUrl}`)
  } catch (error) {
    console.error('Error updating post with Twitter info:', error)
    throw error
  }
}
