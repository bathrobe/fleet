'use server'

/**
 * Validate basic source data requirements
 */
export async function validateSourceBasics(content: string | null, sourceCategory: string | null) {
  const errors = []

  if (!content) {
    errors.push('No content provided')
  }

  if (!sourceCategory) {
    errors.push('Source category is required')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Validate the processed source data before saving
 */
export async function validateSourceData(parsedResult: any) {
  // Check for missing required fields
  const missingRequiredFields = ['title', 'url'].filter((field) => !parsedResult[field])

  return {
    valid: missingRequiredFields.length === 0,
    missingFields: missingRequiredFields,
  }
}

/**
 * Validate frontmatter data if it exists
 */
export async function validateFrontmatter(frontmatterData: any) {
  if (!frontmatterData || Object.keys(frontmatterData).length === 0) {
    return {
      valid: true,
      missingFields: [],
      frontmatterPresent: false,
    }
  }

  // Check for missing required fields in frontmatter
  const missingFields = ['title', 'url'].filter((field) => !frontmatterData[field])

  return {
    valid: missingFields.length === 0,
    missingFields,
    frontmatterPresent: true,
  }
}
