import type { Payload } from 'payload' // Import Payload type
import { Scraper } from 'goat-x'
import { Cookie } from 'tough-cookie'
// import fs from 'fs/promises' // No longer needed
// import path from 'path' // No longer needed
import { setTwitterClient, getTwitterClient } from './store'

// Define the type for the Agent global, including the new field
interface AgentGlobal {
  twitterCookieData?: string | null // Optional string for cookie JSON
  // Add other expected fields from Agent global if needed for type safety
}

// --- Load Cookies using Payload API ---
async function loadStoredCookies(payload: Payload): Promise<Cookie[] | null> {
  console.log('Attempting to load cookies from Payload Agent global...')
  try {
    const agentGlobal = (await payload.findGlobal({
      slug: 'agent',
      depth: 0, // No need for depth
      overrideAccess: true, // Ensure we can read even if logged out user runs action
    })) as AgentGlobal // Cast to our defined interface

    const cookiesJson = agentGlobal?.twitterCookieData

    if (!cookiesJson || typeof cookiesJson !== 'string') {
      console.log('No cookie data found in Agent global or data is not a string.')
      return null
    }

    console.log('Raw cookie JSON from Payload:', cookiesJson.substring(0, 100) + '...') // Log snippet

    const cookiesData = JSON.parse(cookiesJson)

    if (!Array.isArray(cookiesData)) {
      console.error('Parsed cookie data is not an array.')
      return null
    }

    const parsedCookies = cookiesData
      .map((c: any) => {
        try {
          if (typeof c === 'object' && c !== null && 'key' in c && 'value' in c) {
            return Cookie.fromJSON(JSON.stringify(c))
          }
          console.warn('Skipping invalid cookie data item:', c)
          return null
        } catch (cookieParseError) {
          console.error('Error parsing individual cookie JSON:', cookieParseError, 'Data:', c)
          return null
        }
      })
      .filter((c): c is Cookie => c !== null && c !== undefined)

    console.log(`Loaded ${parsedCookies.length} cookies from Payload global.`)
    return parsedCookies.length > 0 ? parsedCookies : null
  } catch (error) {
    console.error(`Error loading cookies from Payload Agent global:`, error)
    return null
  }
}

// --- Store Cookies using Payload API ---
async function storeCookies(payload: Payload, cookies: Cookie[]): Promise<void> {
  console.log(`Attempting to store ${cookies.length} cookies to Payload Agent global...`)
  try {
    // Convert tough-cookie objects back to a serializable format
    const serializableCookies = cookies.map((cookie) => cookie.toJSON())
    const cookiesJson = JSON.stringify(serializableCookies, null, 2)

    await payload.updateGlobal({
      slug: 'agent',
      data: {
        twitterCookieData: cookiesJson,
      },
      overrideAccess: true, // Ensure we can update even if logged out user runs action
    })

    console.log('Cookies stored successfully to Payload Agent global.')
  } catch (error) {
    console.error(`Error storing cookies to Payload Agent global:`, error)
    // Decide if this error should be thrown or just logged
  }
}

// --- Modified initTwitter to accept Payload Client ---
export const initTwitter = async (payload: Payload): Promise<Scraper> => {
  console.log('Initializing Twitter client (using Payload-based cookie strategy)...')
  const existingClient = getTwitterClient(false) // Check store first (in-memory cache for single request)

  if (existingClient) {
    try {
      if (await existingClient.isLoggedIn()) {
        console.log('Using existing, logged-in Twitter client from memory store.')
        return existingClient
      } else {
        console.log('Existing client found in memory but not logged in. Re-initializing.')
      }
    } catch (loginCheckError) {
      console.error(
        'Error checking login status of existing memory client. Re-initializing.',
        loginCheckError,
      )
    }
  }

  const scraper = new Scraper()

  // --- Attempt 1: Cookie Authentication from Payload ---
  console.log('Attempting authentication using stored cookies from Payload...')
  try {
    const cookies = await loadStoredCookies(payload) // Pass Payload client
    if (cookies && cookies.length > 0) {
      try {
        console.log(`Setting ${cookies.length} cookies on scraper instance.`)
        await scraper.setCookies(cookies)
        console.log('Cookies set. Verifying login status...')
        if (await scraper.isLoggedIn()) {
          console.log('Successfully verified login using stored Payload cookies.')
          setTwitterClient(scraper) // Store in memory for this request
          return scraper
        } else {
          console.log('Cookies loaded from Payload, but login check failed (isLoggedIn=false).')
        }
      } catch (error) {
        console.error('Error setting cookies from Payload or checking login status:', error)
      }
    } else {
      console.log('No valid cookies found in Payload global.')
    }
  } catch (error) {
    console.error('Error during Payload cookie loading/authentication flow:', error)
  }

  // --- Attempt 2: Credential Login Fallback ---
  console.log('Falling back to login with credentials...')
  const username = process.env.TWITTER_USERNAME
  const password = process.env.TWITTER_PASSWORD
  const email = process.env.TWITTER_EMAIL

  if (!username || !password) {
    console.error('Twitter username or password not configured.')
    throw new Error('Twitter credentials not configured')
  }

  try {
    await scraper.login(username, password, email)
    console.log('Successfully logged in with credentials.')

    // --- Save New Cookies to Payload ---
    try {
      console.log('Fetching new cookies after login...')
      const newCookies = await scraper.getCookies()
      if (newCookies && newCookies.length > 0) {
        await storeCookies(payload, newCookies) // Pass Payload client
      } else {
        console.log('No cookies returned after login.')
      }
    } catch (error) {
      console.error('Error getting or storing new cookies to Payload:', error)
    }

    setTwitterClient(scraper) // Store in memory for this request
    return scraper
  } catch (loginError) {
    console.error('Error logging in to Twitter with credentials:', loginError)
    setTwitterClient(null) // Clear memory store on failure
    throw loginError
  }
}
