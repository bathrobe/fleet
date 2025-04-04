import { formatSourceInfo, formatSupportingInfo } from '../promptUtils'
import { SynthesisMethodImplementation } from '.'

export const dualDissimilarMethod: SynthesisMethodImplementation = {
  generatePrompt: (atom1, atom2, source1Details, source2Details) => {
    // Prepare supporting info
    const atom1SupportingInfo = formatSupportingInfo(atom1.supportingInfo)
    const atom2SupportingInfo = formatSupportingInfo(atom2.supportingInfo)

    // Prepare source info
    const source1Info = formatSourceInfo(source1Details)
    const source2Info = formatSourceInfo(source2Details)

    return `
<instructions>
I have two deliberately dissimilar concepts that I'd like you to bridge in a creative way.
Your task is to discover unexpected connections between these seemingly unrelated ideas
and create a completely new concept from their synthesis. Don't just combine surface features,
but look for deep patterns, principles, or insights that might emerge from their juxtaposition.

The synthesis should be surprising yet intellectually sound - not merely arbitrary or random,
but revealing something unexpected about how these concepts relate. Focus on creating an
idea that would be difficult to arrive at through conventional thinking about either concept alone.
</instructions>

<concept1>
Title: ${atom1.title || 'Untitled'}
Main Content: ${atom1.mainContent}
${atom1SupportingInfo ? `Supporting Information:\n${atom1SupportingInfo}` : ''}
${source1Info ? source1Info : ''}
</concept1>

<concept2>
Title: ${atom2.title || 'Untitled'}
Main Content: ${atom2.mainContent}
${atom2SupportingInfo ? `Supporting Information:\n${atom2SupportingInfo}` : ''}
${source2Info ? source2Info : ''}
</concept2>

<output_format>
Respond ONLY with a JSON object with these exact fields:
- title: A catchy, brief title for the new concept (5 words max)
- mainContent: One or two substantive sentences that clearly express the new synthesized concept
- supportingInfo: An array of 2-3 objects with a "text" field containing bullet points that elaborate on the concept's implications
- theoryFiction: A short paragraph, styled as a fictional quote, that imagines a future where the concept is realized.

Ensure your response is properly formatted JSON. Do not include markdown code blocks or any text before or after the JSON.
</output_format>
`
  },
}
