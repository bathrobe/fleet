/**
 * Formats an atom's content into a single string for vector embedding
 * Concatenates all relevant fields into a well-structured text representation
 */
export const formatAtomForEmbedding = (atom: any): string => {
  if (!atom) return ''

  const parts: string[] = []

  // Add title with emphasis if it exists
  if (atom.title) {
    parts.push(atom.title)
  }

  // Add main content if it exists
  if (atom.mainContent) {
    parts.push(atom.mainContent)
  }

  // Add supporting info as a list if it exists
  if (atom.supportingInfo && Array.isArray(atom.supportingInfo)) {
    const supportingInfoTexts = atom.supportingInfo.map((item: any) => item.text).filter(Boolean)
    parts.push(supportingInfoTexts.join('\n'))
  }

  if (atom.supportingQuote) {
    parts.push(atom.supportingQuote)
  }

  return parts.join('\n\n')
}
