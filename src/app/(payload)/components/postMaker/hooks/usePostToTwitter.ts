import { useState } from 'react'
import { postToTwitter } from '../actions/postToTwitter'
import type { GeneratedPost } from '../types'

interface PostResult {
  success: boolean
  tweetIds: string[]
}

export const usePostToTwitter = () => {
  const [isPosting, setIsPosting] = useState(false)
  const [result, setResult] = useState<PostResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePost = async (post: GeneratedPost) => {
    console.log('Starting Twitter post process from hook')
    try {
      setIsPosting(true)
      setError(null)

      const postResult = await postToTwitter(post)
      console.log('Post result:', postResult)

      setResult(postResult)
      return postResult
    } catch (error) {
      console.error('Error in Twitter post hook:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setError(errorMessage)
      setResult({ success: false, tweetIds: [] })
      return { success: false, tweetIds: [] }
    } finally {
      setIsPosting(false)
    }
  }

  return { handlePost, isPosting, result, error }
}
