/**
 * Creates a prompt for generating tweets using a synthesized atom and agent data
 */
export function createPostPrompt(atom: any, agentBio: string, agentStyles: string): string {
  // Format parent atoms for context
  const parentAtomsText =
    atom.parentAtoms && atom.parentAtoms.length > 0
      ? atom.parentAtoms
          .filter((parent: any) => typeof parent === 'object')
          .map((parent: any) => {
            if (typeof parent === 'object' && parent) {
              const title = parent.title || 'Unnamed atom'
              const content = parent.mainContent || 'No content'
              const url = parent.url || '' // Include URL if available

              return `<parent_atom>
  <title>${title}</title>
  <content>${content}</content>
  ${url ? `<url>${url}</url>` : ''}
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
You are a social media content creator for an AI agent. Your job is to create engaging tweet threads that showcase synthesized concepts.

<agent_bio>
${agentBio}
</agent_bio>

<style_guide>
${agentStyles}
</style_guide>

I need you to write a two-tweet thread about the following synthesized concept:

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
- Tweet 1: Present the concept in your distinctive voice. Be conversational and engaging.
- Tweet 2: Mention that this idea synthesizes concepts from the parent atoms. Include source URLs if available.
- Each tweet must be under 280 characters.
- Maintain the agent's unique voice and style throughout.
</output_requirements>

Your response MUST be valid JSON containing an array of tweet content, formatted like this:
[
  { "text": "First tweet content here" },
  { "text": "Second tweet content here with source references" }
]

Do not include any explanations or comments outside the JSON object.
</instruction>`
}
