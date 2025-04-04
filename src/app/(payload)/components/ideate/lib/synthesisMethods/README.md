# Synthesis Methods System

This system allows for flexible addition of different synthesis methods for the ideation component. Each method has a unique approach to combining atoms.

## How It Works

1. Synthesis methods have a CMS entry in the `synthesisMethods` collection, containing:

   - Title: Display name
   - Description: Explanation of the method
   - Method Key: Unique identifier (e.g., `dual-dissimilar`)

2. The actual implementation (prompt generation) lives in this directory with:

   - Each method has its own file (e.g., `dualDissimilar.ts`)
   - All methods implement the `SynthesisMethodImplementation` interface
   - Methods are registered in the `index.ts` registry

3. The synthesis process works as follows:
   - User selects a synthesis method in the UI
   - The system loads that method from the CMS by ID
   - Using the method's `methodKey`, it finds the matching implementation
   - The implementation's `generatePrompt` function creates a tailored prompt
   - This prompt is sent to the AI to generate the synthesis

## Adding a New Method

1. Create a CMS entry in the `synthesisMethods` collection with a unique `methodKey`
2. Create a new file in this directory (e.g., `myMethod.ts`)
3. Implement the `SynthesisMethodImplementation` interface
4. Register the method in `index.ts` by adding it to the registry
5. Update the seed script (`scripts/seedSynthesisMethods.ts`) to include your method

```typescript
// Example implementation
import { formatSourceInfo, formatSupportingInfo } from '../promptUtils'
import { SynthesisMethodImplementation } from '.'

export const myNewMethod: SynthesisMethodImplementation = {
  generatePrompt: (atom1, atom2, source1Details, source2Details) => {
    const atom1SupportingInfo = formatSupportingInfo(atom1.supportingInfo)
    const atom2SupportingInfo = formatSupportingInfo(atom2.supportingInfo)
    const source1Info = formatSourceInfo(source1Details)
    const source2Info = formatSourceInfo(source2Details)

    return `
      // Your custom prompt here
    `
  },
}
```

## Available Methods

- **Dual Dissimilar**: Creates connections between deliberately dissimilar concepts
- **Contrast**: Reconciles tensions between contrasting concepts to find a higher-order principle
