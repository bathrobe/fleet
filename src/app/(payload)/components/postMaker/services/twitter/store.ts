import { Scraper } from 'goat-x'

let twitterClient: Scraper | null = null

export const getTwitterClient = (throwIfNotInitialized: boolean = true): Scraper | null => {
  if (!twitterClient) {
    console.log('Twitter client reference is null')
    if (throwIfNotInitialized) {
      console.error('Throwing error: Twitter not initialized')
      throw new Error('Twitter not initialized')
    }
    return null
  }
  console.log('Retrieved existing Twitter client instance')
  return twitterClient
}

export const setTwitterClient = (client: Scraper | null) => {
  console.log(client ? 'Setting Twitter client' : 'Clearing Twitter client')
  twitterClient = client
}
