# blank

blank

## Attributes

- **Database**: mongodb
- **Storage Adapter**: localDisk

# Server Actions Refactoring

## Overview

This codebase has been refactored to use Next.js 15 Server Actions instead of traditional API routes where appropriate. Server Actions provide a more integrated approach for handling server-side logic directly within components.

## Benefits of Server Actions

- **Better Type Safety**: End-to-end type safety between client and server
- **Improved Performance**: Reduces client-server roundtrips
- **Progressive Enhancement**: Works without JavaScript enabled
- **Better Developer Experience**: No need to create separate API endpoints for simple data operations
- **Simplified Error Handling**: Errors can be handled more naturally in the component flow

## Folder Structure

```
src/app/(frontend)/
├── actions/             # Server actions organized by feature
│   ├── atoms.ts         # Actions related to atoms
│   ├── synthesize.ts    # Actions related to synthesis
│   └── index.ts         # Export all actions
└── components/          # Client components using server actions
```

## Usage Examples

### Client Component

```tsx
'use client'
import { synthesizeAtoms } from '@/app/(frontend)/actions'

export function MyComponent() {
  const handleAction = async () => {
    try {
      const result = await synthesizeAtoms(data1, data2)
      // Handle result
    } catch (error) {
      // Handle error
    }
  }

  return <button onClick={handleAction}>Perform Action</button>
}
```

### Server Action

```tsx
'use server'

export async function myServerAction(data) {
  // Server-side logic here
  return result
}
```

## Previously Replaced API Routes

The following API routes were replaced with Server Actions and have been removed from the codebase:

- `/ideate/synthesize-atoms` → `synthesizeAtoms`
- `/ideate/random-atom` → `getRandomAtomPair`
- `/api/atoms` → `getAtoms`
