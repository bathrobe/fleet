import { dualDissimilarMethod } from './dualDissimilar'
import { contrastMethod } from './contrast'
// Import other methods as they are added

export type SynthesisMethodImplementation = {
  generatePrompt: (atom1: any, atom2: any, source1Details?: any, source2Details?: any) => string
}

/**
 * Registry of all synthesis methods with their implementation
 * Keys should match the methodKey in the SynthesisMethods collection
 */
export const synthesisMethodRegistry: Record<string, SynthesisMethodImplementation> = {
  'dual-dissimilar': dualDissimilarMethod,
  contrast: contrastMethod,
  // Add other methods as they are implemented
}

/**
 * Get synthesis method implementation by key
 * @param methodKey The key that identifies the method in the registry
 * @returns The implementation or undefined if not found
 */
export function getSynthesisMethodImplementation(
  methodKey?: string,
): SynthesisMethodImplementation | undefined {
  if (!methodKey) return undefined
  return synthesisMethodRegistry[methodKey]
}
