/**
 * Seed script to populate the synthesisMethods collection with default methods
 * Run with: ts-node scripts/seedSynthesisMethods.ts
 */

// For local development environment variables
import * as dotenv from 'dotenv'
import path from 'path'
import { getPayload } from 'payload'
import config from '../src/payload.config'

// Load environment variables
dotenv.config()

// Define initial synthesis methods
const INITIAL_METHODS = [
  {
    title: 'Dual Dissimilar Atoms',
    description: 'Combine two atoms that are semantically dissimilar to generate a novel concept.',
    methodKey: 'dual-dissimilar',
  },
]

async function seed() {
  // Initialize Payload
  const payload = await getPayload({
    config,
    local: true,
  })

  console.log('Checking for existing synthesis methods...')

  // Check if we already have methods in the database
  const existingMethods = await payload.find({
    collection: 'synthesisMethods',
    limit: 100,
  })

  if (existingMethods.docs.length > 0) {
    console.log(`Found ${existingMethods.docs.length} existing synthesis methods.`)
  } else {
    console.log('No existing synthesis methods found. Creating initial methods...')

    // Create the initial methods
    for (const method of INITIAL_METHODS) {
      try {
        await payload.create({
          collection: 'synthesisMethods',
          data: method,
        })
        console.log(`Created synthesis method: ${method.title}`)
      } catch (error) {
        console.error(`Error creating method ${method.title}:`, error)
      }
    }
  }

  // Exit successfully
  process.exit(0)
}

// Run the seed function
seed().catch((error) => {
  console.error('Seed error:', error)
  process.exit(1)
})
