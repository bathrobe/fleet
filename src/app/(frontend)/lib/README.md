# Frontend Library Code

This directory contains library code that is specific to the frontend application.

## Purpose

The code in this directory is used by frontend components and should not be used directly by backend (Payload) code. This separation helps maintain a clean architecture and prevents coupling between frontend and backend.

## Contents

- **atoms.ts**: Types and utilities for atoms (core data structure used in the frontend)
- **ideation-methods.ts**: Types and functions for ideation methods
- **utils.ts**: Common utility functions used in the frontend
- **index.ts**: Exports all types and functions for easy importing

## How to Use

Import from this directory when you need types or utilities that are specific to the frontend:

```typescript
// Import specific items
import { Atom } from '@/app/(frontend)/lib/atoms'
import { cn } from '@/app/(frontend)/lib/utils'

// Or import from the index file
import { Atom, cn, IdeationMethod } from '@/app/(frontend)/lib'
```

## When to Add Code Here

Add code to this directory when:

1. It's used exclusively by frontend components
2. It defines types or interfaces specific to the frontend
3. It provides utility functions for frontend operations
