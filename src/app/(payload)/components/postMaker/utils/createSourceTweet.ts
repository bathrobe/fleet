import type { SynthesizedAtom } from '../../../../../payload-types'

export const createSourceTweet = (atom: SynthesizedAtom): string => {
  // Extract URLs from parent atoms that have posting info
  console.log('atom', atom)

  const sourceUrls =
    atom.parentAtoms
      ?.filter((parent: any) => typeof parent === 'object' && parent !== null)
      .map((parent: any) => {
        // Check if parent has posting property with URLs
        // Check for direct URL property
        if (parent.source.url) {
          return parent.source.url
        }

        return ''
      })
      .filter(Boolean) || []

  // Create concept graph URL using the short format
  const baseUrl = `${process.env.SITEURL}/?v=${atom.pineconeId}&a=${atom.id}&t=s`

  // Construct the source tweet
  const sourceTweet = `Sources: ${sourceUrls.join(', ')}\n\nExplore in concept graph: ${baseUrl}`

  return sourceTweet
}
