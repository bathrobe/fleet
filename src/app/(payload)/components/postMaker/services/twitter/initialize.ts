import { Scraper } from 'goat-x'
import { Cookie } from 'tough-cookie'
import fs from 'fs/promises'
import { setTwitterClient } from './store'

// Load cookies from file
const loadCookies = async (cookiePath: string): Promise<Cookie[] | null> => {
  console.log('Attempting to load cookies from:', cookiePath)
  try {
    const fileExists = await fs
      .access(cookiePath)
      .then(() => true)
      .catch(() => false)
    if (!fileExists) {
      console.log('Cookie file does not exist')
      return null
    }

    const cookiesJson = await fs.readFile(cookiePath, 'utf-8')
    console.log('Successfully read cookie file')

    const cookies = JSON.parse(cookiesJson)
      .map((c: any) => Cookie.fromJSON(c))
      .filter((c: Cookie | null): c is Cookie => c !== null)

    console.log(`Loaded ${cookies.length} cookies`)
    return cookies
  } catch (error) {
    console.error('Error loading cookies:', error)
    return null
  }
}

// Store cookies to file
const storeCookies = async (cookies: Cookie[], cookiePath: string): Promise<void> => {
  console.log('Attempting to store cookies to:', cookiePath)
  try {
    await fs.writeFile(cookiePath, JSON.stringify(cookies, null, 2))
    console.log('Successfully stored cookies')
  } catch (error) {
    console.error('Error storing cookies:', error)
  }
}

// Initialize Twitter client
export const initTwitter = async () => {
  console.log('Initializing Twitter client')
  const scraper = new Scraper()
  const cookiePath = process.env.TWITTER_COOKIE_PATH || './twitter_cookie.json'

  // Try loading cookies first
  const cookies = await loadCookies(cookiePath)
  if (cookies) {
    console.log('Attempting to use stored cookies')
    try {
      await scraper.setCookies(cookies)
      const isLoggedIn = await scraper.isLoggedIn()
      if (isLoggedIn) {
        console.log('Successfully logged in with stored cookies')
        setTwitterClient(scraper)
        return scraper
      }
      console.log('Stored cookies are invalid')
    } catch (error) {
      console.error('Error using stored cookies:', error)
    }
  }

  // Fall back to login if cookies don't work
  console.log('Attempting login with credentials')
  try {
    const username = process.env.TWITTER_USERNAME
    const password = process.env.TWITTER_PASSWORD
    const email = process.env.TWITTER_EMAIL

    if (!username || !password || !email) {
      throw new Error('Missing Twitter credentials in environment variables')
    }

    await scraper.login(username, password, email)
    console.log('Successfully logged in with credentials')

    // Store new cookies
    const newCookies = await scraper.getCookies()
    await storeCookies(newCookies, cookiePath)

    setTwitterClient(scraper)
    return scraper
  } catch (error) {
    console.error('Error logging in to Twitter:', error)
    throw error
  }
}
