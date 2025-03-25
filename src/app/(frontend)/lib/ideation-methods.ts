// Define types for ideation methods
export type IdeationMethod = {
  id: string
  name: string
  description: string
}

// List of available ideation methods
export const ideationMethods: IdeationMethod[] = [
  {
    id: 'dual-dissimilar',
    name: 'Dual Dissimilar Atoms',
    description: 'Display two atoms: one random and one that is semantically dissimilar',
  },
  // More methods will be added here in the future
]

// Get the default ideation method
export function getDefaultMethod(): IdeationMethod {
  return ideationMethods[0]
}

// Get an ideation method by ID
export function getMethodById(id: string): IdeationMethod | undefined {
  return ideationMethods.find((method) => method.id === id)
}
