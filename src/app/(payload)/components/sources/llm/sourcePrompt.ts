'use server'
import { getCompletion } from '../../../../../utilities/anthropic'

export const processSourceWithLLM = async (content: string, apiKey: string): Promise<any> => {
  const prompt = `
<Instructions>
Output a markdown artifact with the following fields:
#### Summary 
One sentence summary here. The summary should only be one complete sentence and should be concise and readable. 

#### Main points 
- Here you should put 2-5 main points outlining the key ideas in the transcript 
- Each bullet should be a complete sentence. 
- Each main point should stand on its own. 

#### Bullet summary 
- This is a more indepth summary of the transcript that covers everything in it using a bullet list of 8-12 bullets. 
- These should also be complete sentences. 
- Be sure to cover anything important that was missed by the preceding two sections. 

#### People, Places, and Things 
List a maximum of 6 proper nouns mentioned in the transcript that would be worth knowing about. Do so in this format:

Name of proper noun - 1-2 sentences explanation of the entity 

Next one - etc.

#### Interesting Details 
- Include a maximum of 4 interesting bits of trivia, asides, anecdotes, apocrypha, etc. that have not been picked up in previous sections 

#### Quotations
If any of the figures in the transcipt (besides the lecturer) have a unique or memorable quotation, deposit it here with attribution in markdown blockquote format (> quote \n - Attribution)

***
Stylistically, be sure to write all this prose at an eighth grade reading level and avoid run on sentences.

Note: Any frontmatter metadata (like title, url, author, date) may have already been extracted from the content, so focus on analyzing the main text content only.
</Instructions>

<Format>
Structure your output in valid JSON in the following format:
{
  "oneSentenceSummary": "string - One sentence summary here. The summary should only be one complete sentence and should be concise and readable.",
  "mainPoints": "string - 2-5 main points outlining the key ideas in the transcript",
  "bulletSummary": "string - More indepth summary of the transcript that covers everything in it using a bullet list of 8-12 bullets.",
  "peopleplacesthingsevents": "string - List of 1-6 proper nouns mentioned in the transcript that would be worth knowing about.",
  "details": "string - 2-4 interesting bits of trivia, asides, anecdotes, apocrypha, etc. that have not been picked up in previous sections",
  "quotations": "string - Any unique or memorable quotations from figures in the transcript with attribution. If there are none, leave blank"
}

ALL fields are REQUIRED and must be included in your response exactly as named (camelCase, no spaces). 
Do not leave any fields empty - they must contain appropriate content based on your analysis.
The field names must match exactly as shown above. Do not change the field names or case.
</Format>

<Content>
${content}
</Content>

<Output>`

  try {
    const response = await getCompletion(prompt, apiKey)
    return response
  } catch (error) {
    console.error('Error processing source with LLM:', error)
  }
}
