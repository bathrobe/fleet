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
