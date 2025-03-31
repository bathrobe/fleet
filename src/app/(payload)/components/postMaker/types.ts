// Import the generated types from Payload
import { SynthesizedAtom as PayloadSynthesizedAtom } from '../../../../payload-types'

// Re-export with modifications for our usage, but make it permissive
export interface SynthesizedAtom extends Omit<PayloadSynthesizedAtom, 'id'> {
  id: string // Convert id to string for consistency
  [key: string]: any // Allow any additional properties for flexibility
}

export interface PostContent {
  text: string
  media?: string | null
  isSourceTweet?: boolean
  [key: string]: any // Allow any additional properties
}

export interface GeneratedPost {
  content: PostContent[]
  usage?: any // Loose typing for token usage
  model?: string
  error?: string
  [key: string]: any // Allow any additional properties
}
