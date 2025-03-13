/**
 * Utility functions related to environment configuration
 */

/**
 * Determines if we're running in a development environment
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development'
}

/**
 * Returns the appropriate timeout for an operation based on the environment
 * In development, timeouts are extended to account for slower processing
 */
export const getOperationTimeout = (operation: 'atoms' | 'source'): number => {
  const isDevEnv = isDevelopment()

  const timeouts = {
    development: {
      atoms: 120000, // 2 minutes for dev
      source: 60000, // 1 minute for dev
    },
    production: {
      atoms: 45000, // 45 seconds for prod
      source: 30000, // 30 seconds for prod
    },
  }

  return isDevEnv ? timeouts.development[operation] : timeouts.production[operation]
}
