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
  if (atom.supportingInfo) {
    parts.push(atom.supportingInfo)
  }

  if (atom.supportingQuote) {
    parts.push(atom.supportingQuote)
  }

  return parts.join('\n\n')
}

/**
 * Formats a synthesized atom's content into a single string for vector embedding
 * Similar to formatAtomForEmbedding but handles the different structure of synthesized atoms
 */
export const formatSynthesizedAtomForEmbedding = (atom: any): string => {
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
    const supportingInfoText = atom.supportingInfo
      .map((info: any) => info.text)
      .filter(Boolean)
      .join('\n')

    if (supportingInfoText) {
      parts.push(supportingInfoText)
    }
  }

  // Add theory fiction if it exists
  if (atom.theoryFiction) {
    parts.push(atom.theoryFiction)
  }

  // Add parent atoms titles and content for better context
  if (atom.parentAtoms && Array.isArray(atom.parentAtoms)) {
    const parentAtomsText = atom.parentAtoms
      .map((parent: any) => {
        if (typeof parent === 'object' && parent) {
          return [parent.title, parent.mainContent].filter(Boolean).join(' - ')
        }
        return null
      })
      .filter(Boolean)
      .join('\n')

    if (parentAtomsText) {
      parts.push(`Parent atoms: ${parentAtomsText}`)
    }
  }

  return parts.join('\n\n')
}

/**
 * Formats a source document's content into a single string for vector embedding
 * Extracts and combines relevant fields from source document for semantic search
 */
export const formatSourceForEmbedding = (source: any): string => {
  if (!source) return ''

  const parts: string[] = []

  // Add title
  if (source.title) {
    parts.push(source.title)
  }

  // Add one sentence summary
  if (source.oneSentenceSummary) {
    parts.push(source.oneSentenceSummary)
  }

  // Add main points if they exist
  if (source.mainPoints && Array.isArray(source.mainPoints)) {
    const mainPointsText = source.mainPoints
      .map((point: any) => point.text)
      .filter(Boolean)
      .join('\n')

    if (mainPointsText) {
      parts.push(mainPointsText)
    }
  }

  // Add bullet summary if it exists
  if (source.bulletSummary && Array.isArray(source.bulletSummary)) {
    const bulletSummaryText = source.bulletSummary
      .map((bullet: any) => bullet.text)
      .filter(Boolean)
      .join('\n')

    if (bulletSummaryText) {
      parts.push(bulletSummaryText)
    }
  }

  // Add important quotations
  if (source.quotations && Array.isArray(source.quotations)) {
    const quotationsText = source.quotations
      .map((quote: any) => quote.text)
      .filter(Boolean)
      .join('\n')

    if (quotationsText) {
      parts.push(quotationsText)
    }
  }

  // Add people, places, things, events if they exist
  if (source.peopleplacesthingsevents && Array.isArray(source.peopleplacesthingsevents)) {
    const ppteText = source.peopleplacesthingsevents
      .map((item: any) => item.text)
      .filter(Boolean)
      .join(', ')

    if (ppteText) {
      parts.push(`Entities: ${ppteText}`)
    }
  }

  // Add author and date if available
  if (source.author) {
    parts.push(`Author: ${source.author}`)
  }

  if (source.publishedDate) {
    parts.push(`Published: ${source.publishedDate}`)
  }

  return parts.join('\n\n')
}
