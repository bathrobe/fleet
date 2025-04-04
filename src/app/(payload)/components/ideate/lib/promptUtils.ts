/**
 * Format supporting info array into a string
 * @param supportingInfo Array of supporting info items
 * @returns Formatted string or empty string if no supportingInfo
 */
export function formatSupportingInfo(supportingInfo?: { text: string }[]): string {
  if (!supportingInfo || !supportingInfo.length) return ''

  return supportingInfo.map((info) => `- ${info.text}`).join('\n')
}

/**
 * Format source details into a string for inclusion in prompts
 * @param sourceDetails Source metadata
 * @returns Formatted string or empty string if no source details
 */
export function formatSourceInfo(sourceDetails?: any): string {
  if (!sourceDetails || !Object.keys(sourceDetails).length) return ''

  let result = ''

  if (sourceDetails.title) {
    result += `Source: ${sourceDetails.title}`
    if (sourceDetails.author) {
      result += ` by ${sourceDetails.author}`
    }
    result += '\n'
  }

  if (sourceDetails.bulletSummary?.length) {
    result += 'Source Summary:\n'
    result += sourceDetails.bulletSummary.map((bullet: any) => `- ${bullet.text}`).join('\n')
  }

  return result
}

/**
 * Helper to safely get nested properties from objects
 * @param obj Object to get property from
 * @param path Dot notation path to property
 * @param defaultValue Default value if property doesn't exist
 * @returns Property value or default
 */
export function getNestedProperty(obj: any, path: string, defaultValue: any = ''): any {
  const properties = path.split('.')
  let value = obj

  for (const prop of properties) {
    if (value === null || value === undefined || typeof value !== 'object') {
      return defaultValue
    }
    value = value[prop]
  }

  return value !== undefined ? value : defaultValue
}
