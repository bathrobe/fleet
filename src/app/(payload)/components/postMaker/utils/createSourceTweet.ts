import type { SynthesizedAtom } from '../../../../../payload-types'

export const createSourceTweet = (atom: SynthesizedAtom): string => {
  // Extract URLs and titles from parent atoms that have posting info
  console.log('atom', atom)

  const sourceLines =
    atom.parentAtoms
      ?.filter((parent: any) => typeof parent === 'object' && parent !== null)
      .map((parent: any) => {
        // Get the title and URL
        const title = parent.title || 'Untitled Atom'
        const url = parent.source?.url || ''

        if (url) {
          return `- ${title}, ${url}`
        }
        return ''
      })
      .filter(Boolean) || []

  // Create concept graph URL using the short format
  const baseUrl = `${process.env.SITEURL}/?v=${atom.pineconeId}&a=${atom.id}&t=s`

  // Construct the source tweet with formatted sources
  const sourceTweet = `sources:\n${sourceLines.join('\n')}\n\nexplore: ${atom.title}, ${baseUrl}`

  return sourceTweet
}
