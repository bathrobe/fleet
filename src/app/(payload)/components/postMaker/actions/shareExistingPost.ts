'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { convertPayloadToGeneratedPost } from '../utils/postFormats'
import { postToTwitter } from './postToTwitter'
import { updatePostWithTwitterInfo } from './updatePostWithTwitter'

export const shareExistingPostToTwitter = async (
  postId: string,
): Promise<{
  success: boolean
  twitterInfo?: {
    success: boolean
    tweetIds: string[]
    tweetUrls: string[]
  }
}> => {
  try {
    // Initialize Payload
    const payload = await getPayload({ config })

    // Get the post from Payload
    const existingPost = await payload.findByID({
      collection: 'posts',
      id: postId,
    })

    if (!existingPost) {
      throw new Error(`Post with ID ${postId} not found`)
    }

    // Convert to GeneratedPost format and post to Twitter
    const generatedPost = convertPayloadToGeneratedPost(existingPost)
    const twitterResult = await postToTwitter(generatedPost)

    // If Twitter posting was successful, update the post
    if (twitterResult.success && twitterResult.tweetIds.length > 0) {
      // @ts-ignore
      await updatePostWithTwitterInfo(postId, twitterResult.tweetIds[0], twitterResult.tweetUrls[0])
    }

    return {
      success: true,
      // @ts-ignore
      twitterInfo: twitterResult,
    }
  } catch (error) {
    console.error('Error sharing existing post to Twitter:', error)
    return { success: false }
  }
}
