import { Scraper } from 'goat-x'

let twitterClient: Scraper | null = null

export const getTwitterClient = () => {
  if (!twitterClient) {
    console.log('Twitter client not initialized')
    throw new Error('Twitter not initialized')
  }
  console.log('Retrieved Twitter client')
  return twitterClient
}

export const setTwitterClient = (client: Scraper) => {
  console.log('Setting Twitter client')
  twitterClient = client
}
