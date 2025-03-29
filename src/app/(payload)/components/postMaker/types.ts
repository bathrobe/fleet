// Import the generated types from Payload
import { SynthesizedAtom as PayloadSynthesizedAtom } from '../../../../payload-types'

// Re-export with modifications for our usage
export interface SynthesizedAtom extends Omit<PayloadSynthesizedAtom, 'id'> {
  id: string // Convert id to string for consistency
}

export interface PostContent {
  text: string
  media?: string | null
}

export interface GeneratedPost {
  content: PostContent[]
}
