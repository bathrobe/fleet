'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import type { GeneratedPost } from '../types'
import { convertGeneratedToPayloadPost } from '../utils/postFormats'
import { postToTwitter } from './postToTwitter'
import { createTwitterUrl } from '../utils/twitterUrls'

export const createPostWithTwitter = async (
  post: GeneratedPost,
): Promise<{
  success: boolean
  postId?: string
  twitterInfo?: {
    success: boolean
    tweetIds: string[]
    tweetUrls: string[]
  }
}> => {
  try {
    // Initialize Payload
    const payload = await getPayload({ config })

    // Post to Twitter first to get the IDs and URLs
    const twitterResult = await postToTwitter(post)

    if (!twitterResult.success || twitterResult.tweetIds.length === 0) {
      return { success: false }
    }

    // Create the post with Twitter info included
    const createdPost = await payload.create({
      collection: 'posts',
      // @ts-ignore
      data: {
        ...convertGeneratedToPayloadPost(post),
        twitterPost: {
          posted: true,
          postId: twitterResult.tweetIds[0], // First tweet ID in the thread
          // @ts-ignore
          url: twitterResult.tweetUrls[0], // First tweet URL in the thread
        },
      },
    })

    return {
      success: true,
      // @ts-ignore
      postId: createdPost.id,
      // @ts-ignore
      twitterInfo: twitterResult,
    }
  } catch (error) {
    console.error('Error creating post with Twitter:', error)
    return { success: false }
  }
}
