import type { GeneratedPost } from '../types'

export const convertPayloadToGeneratedPost = (payloadPost: any): GeneratedPost => {
  return {
    content: payloadPost.content.map((item: any) => ({
      text: item.text,
      media: item.media || undefined,
      isSourceTweet: false, // Could enhance this by defining a convention
    })),
  }
}

export const convertGeneratedToPayloadPost = (generatedPost: GeneratedPost) => {
  return {
    content: generatedPost.content.map((tweet) => ({
      text: tweet.text,
      ...(tweet.media ? { media: tweet.media } : {}),
    })),
  }
}
