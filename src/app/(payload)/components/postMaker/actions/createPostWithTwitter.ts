'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import type { GeneratedPost } from '../types'
import { convertGeneratedToPayloadPost } from '../utils/postFormats'
import { postToTwitter } from './postToTwitter'
import { createTwitterUrl } from '../utils/twitterUrls'

export const createPostWithTwitter = async (
  post: GeneratedPost,
  synthesizedAtomId: string,
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

    // Create tweet URLs from the IDs
    const tweetUrls = twitterResult.tweetIds.map((id) => createTwitterUrl(id))

    // Create the post with Twitter info included
    const createdPost = await payload.create({
      collection: 'posts',
      data: {
        ...convertGeneratedToPayloadPost(post),
        synthesizedAtom: synthesizedAtomId,
        twitterPost: {
          posted: true,
          postId: twitterResult.tweetIds[0], // First tweet ID in the thread
          url: tweetUrls[0], // First tweet URL in the thread
        },
      } as any, // Type assertion to fix TypeScript error
    })

    return {
      success: true,
      postId: String(createdPost.id), // Convert to string to match return type
      twitterInfo: {
        success: twitterResult.success,
        tweetIds: twitterResult.tweetIds,
        tweetUrls: tweetUrls,
      },
    }
  } catch (error) {
    console.error('Error creating post with Twitter:', error)
    return { success: false }
  }
}
