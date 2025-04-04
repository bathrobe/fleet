import { formatSourceInfo, formatSupportingInfo } from '../promptUtils'
import { SynthesisMethodImplementation } from '.'

export const contrastMethod: SynthesisMethodImplementation = {
  generatePrompt: (atom1, atom2, source1Details, source2Details) => {
    // Prepare supporting info
    const atom1SupportingInfo = formatSupportingInfo(atom1.supportingInfo)
    const atom2SupportingInfo = formatSupportingInfo(atom2.supportingInfo)

    // Prepare source info
    const source1Info = formatSourceInfo(source1Details)
    const source2Info = formatSourceInfo(source2Details)

    return `
<instructions>
I have two concepts that seem to contrast or even contradict each other.
Your task is to create a new idea that emerges from examining and reconciling
this tension. Pay special attention to how these opposing concepts might 
reveal a deeper principle, dialectic synthesis, or complementary relationship.

Don't simply compromise between the two ideas or discard their contradictions.
Instead, use the tension as creative fuel to transcend the apparent opposition
and generate something novel that couldn't exist without both initial concepts.
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
