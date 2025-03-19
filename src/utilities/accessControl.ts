export const hasValidApiKey = (req: any): boolean => {
  // Headers can be accessed in different ways depending on how they're normalized
  // Try multiple ways to access the API key
  const apiKey =
    req.headers['x-api-key'] ||
    (req.headers.get && req.headers.get('x-api-key')) ||
    req.headers['X-API-KEY'] ||
    (req.headers.get && req.headers.get('X-API-KEY'))

  const validApiKey = process.env.PAYLOAD_REST_API_KEY

  const normalizedApiKey = Array.isArray(apiKey) ? apiKey[0] : apiKey

  return normalizedApiKey === validApiKey
}

/**
 * Access control function that allows access if:
 * - User is authenticated (for admin panel)
 * - OR request has a valid API key (for API requests)
 */
export const allowIfApiKeyOrAuthenticated: any = ({ req }: { req: any }) => {
  // Allow access if user is authenticated (for admin panel)
  if (req.user) return true

  // Allow access if request has valid API key
  return hasValidApiKey(req)
}

/**
 * Access control function that requires valid API key only
 * (more restrictive, doesn't allow authenticated users)
 */
export const requireApiKey: any = ({ req }: { req: any }) => {
  return hasValidApiKey(req)
}
