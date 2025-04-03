export const createTwitterUrl = (tweetId: string): string => {
  const username = process.env.TWITTER_USERNAME
  if (!username) {
    throw new Error('Twitter username not found in environment variables')
  }
  return `https://twitter.com/${username}/status/${tweetId}`
}
