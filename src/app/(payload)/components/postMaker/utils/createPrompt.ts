/**
 * Creates a prompt for generating tweets using a synthesized atom and agent data
 */
export function createPostPrompt(atom: any, agentBio: string, agentStyles: string): string {
  // console.log('Creating post prompt for atom:', atom)
  const { parentAtoms, supportingInfo, theoryFiction } = atom

  // Format parent atoms for context
  const parentAtomsText =
    atom.parentAtoms && atom.parentAtoms.length > 0
      ? atom.parentAtoms
          .filter((parent: any) => typeof parent === 'object')
          .map((parent: any) => {
            if (typeof parent === 'object' && parent) {
              const title = parent.title || 'Unnamed atom'
              const content = parent.mainContent || 'No content'
              const supportingQuote = parent.supportingQuote || ''

              // Format supporting info from parent atom
              const parentSupportingInfo =
                parent.supportingInfo && parent.supportingInfo.length > 0
                  ? parent.supportingInfo
                      .map((info: any) => `<supporting_point>${info.text}</supporting_point>`)
                      .join('\n')
                  : '<no_supporting_info>No supporting information available</no_supporting_info>'

              // Extract URL from parent atom if available
              // First check if there's a direct URL property
              let url = parent.url || ''

              // Then check if there's a posting group with URLs
              if (!url && parent.posting) {
                // Try to get Twitter URL first, then Bluesky URL as fallback
                url = parent.posting.twitterUrl || parent.posting.bskyUrl || ''
              }

              // Extract simplified source information if available
              const sourceInfo = parent.source
                ? `<source>
    <title>${parent.source.title || 'Untitled Source'}</title>
    <url>${parent.source.url || ''}</url>
    <author>${parent.source.author || ''}</author>
    <summary>${parent.source.oneSentenceSummary || ''}</summary>
    ${
      parent.source.bulletSummary && parent.source.bulletSummary.length > 0
        ? `<bullet_summary>
      ${parent.source.bulletSummary.map((b: any) => `<bullet>${b.text}</bullet>`).join('\n      ')}
    </bullet_summary>`
        : ''
    }
  </source>`
                : ''

              return `<parent_atom>
  <title>${title}</title>
  <content>${content}</content>
  ${supportingQuote ? `<supporting_quote>${supportingQuote}</supporting_quote>` : ''}
  <supporting_info>
${parentSupportingInfo}
  </supporting_info>
  ${url ? `<url>${url}</url>` : ''}
  ${sourceInfo}
</parent_atom>`
            }
            return ''
          })
          .filter(Boolean)
          .join('\n\n')
      : '<no_parent_atoms>No parent atoms available</no_parent_atoms>'

  // Format supporting info
  const supportingInfoText =
    atom.supportingInfo && atom.supportingInfo.length > 0
      ? atom.supportingInfo
          .map((info: any) => `<supporting_point>${info.text}</supporting_point>`)
          .join('\n')
      : '<no_supporting_info>No supporting information available</no_supporting_info>'

  // Build the theory fiction section if available
  const theoryFictionSection = atom.theoryFiction
    ? `<theory_fiction>
${atom.theoryFiction}
</theory_fiction>`
    : ''

  // Construct the prompt with XML-style sections
  return `<instruction>
<agent_bio>
${agentBio}
</agent_bio>

<style_guide>
${agentStyles}
</style_guide>

<task>
Write a single tweet exploring the ideas underlying the concept below. Be imaginative and creative, and use the style and tone of the agent's bio and style guide.
</task>

<concept>
  <title>${atom.title}</title>
  <main_content>${atom.mainContent}</main_content>
  
  <supporting_info>
${supportingInfoText}
  </supporting_info>
  
${theoryFictionSection}
  
  <parent_atoms>
${parentAtomsText}
  </parent_atoms>
</concept>

<output_requirements>
- Write one tweet that presents the concept in your distinctive voice
- The tweet MUST be under 280 characters
- Maintain the agent's unique voice and style
- Do not include any explanations or comments outside the JSON object
</output_requirements>

Your response MUST be valid JSON containing an array with a single tweet object, formatted like this:
[
  { "text": "Your tweet content here" }
]

Do not include any explanations or comments outside the JSON object.
REMEMBER: The tweet MUST be under 280 characters. DO NOT EXCEED THIS LIMIT.
</instruction>`
}
