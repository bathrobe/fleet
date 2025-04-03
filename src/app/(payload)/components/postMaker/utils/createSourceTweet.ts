import type { SynthesizedAtom, Atom } from '../../../../../payload-types'

export const createSourceTweet = (atom: SynthesizedAtom): string => {
  // Construct URL (ensure protocol and valid IDs)
  const siteUrl = process.env.SITEURL || ''
  const baseUrlWithProtocol = siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`
  const pineconeIdStr = typeof atom.pineconeId === 'string' ? atom.pineconeId : 'null'
  const atomIdStr = typeof atom.id === 'string' ? atom.id : 'null'
  const exploreUrl = `${baseUrlWithProtocol}/?v=${pineconeIdStr}&a=${atomIdStr}&t=s`

  // Use atom.title safely
  const atomTitle = atom.title || 'this concept'

  // Only include the explore link and the atom's title
  const sourceTweet = `explore: ${atomTitle}, ${exploreUrl}`

  return sourceTweet
}
