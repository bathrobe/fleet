import matter from 'gray-matter'

export const parseFrontmatter = (content: string) => {
  if (!content.trim()) {
    return { data: null, error: null, content: null }
  }

  try {
    const { data, content: markdownContent } = matter(content)

    if (Object.keys(data).length === 0) {
      return {
        data: null,
        error: 'No frontmatter detected in the content',
        content: markdownContent,
      }
    }

    return {
      data,
      error: null,
      content: markdownContent,
    }
  } catch (err: any) {
    return {
      data: null,
      error: `Error parsing content: ${err.message}`,
      content: null,
    }
  }
}

// Helper function to extract the first non-null value
const getFirstValue = (...values: any[]): any => {
  return values.find((v) => v !== null && v !== undefined && v !== '') || null
}

// Helper to convert various tag formats into the required array format
const formatTags = (tagData: any): { tag: string }[] | null => {
  if (!tagData) return null

  if (Array.isArray(tagData)) {
    return tagData.map((tag) => ({ tag: String(tag) }))
  }

  if (typeof tagData === 'string') {
    return tagData
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .map((tag) => ({ tag }))
  }

  return [{ tag: String(tagData) }]
}

/**
 * Extract specific fields from frontmatter data for use in source creation
 */
export const extractSourceFields = (frontmatterData: any) => {
  if (!frontmatterData) return {}

  // Handle date values which might be in various formats
  let publishedDate = getFirstValue(
    frontmatterData.date,
    frontmatterData.publishedDate,
    frontmatterData.published,
    frontmatterData.publishedAt,
    frontmatterData.datePublished,
  )

  // Convert Date objects to ISO string for consistent storage
  if (publishedDate instanceof Date) {
    publishedDate = publishedDate.toISOString()
  }

  // Handle tags with fallback to categories if available
  const tags = formatTags(frontmatterData.tags) || formatTags(frontmatterData.categories)

  return {
    title: getFirstValue(frontmatterData.title, frontmatterData.headline, frontmatterData.name),
    url: getFirstValue(
      frontmatterData.url,
      frontmatterData.link,
      frontmatterData.permalink,
      frontmatterData.canonical,
    ),
    author: getFirstValue(
      frontmatterData.author,
      frontmatterData.authors,
      frontmatterData.by,
      frontmatterData.creator,
    ),
    publishedDate,
    tags,
  }
}
