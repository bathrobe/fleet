# Component and Library Structure Refactoring

## Overview

This project's component and library structure has been refactored to follow a clearer frontend/backend separation pattern. Previously, there were components and utilities spread across multiple directories:

- `/src/components/` (root level components)
- `/src/app/(frontend)/components/`
- `/src/app/(payload)/components/`
- `/src/lib/` (root level utilities)

This inconsistent organization made it difficult to understand where components and utilities belonged and led to confusing import patterns.

## Changes Made

1. **Component Structure**:

   - All frontend components have been moved to `/src/app/(frontend)/components/`
   - The old `/src/components/` directory has been completely removed
   - Duplicate components have been renamed for clarity:
     - `AtomCard.tsx` → `SimpleAtomCard.tsx`
     - `AtomDisplay/AtomCard.tsx` → `DetailedAtomCard.tsx`

2. **Library Structure**:

   - Created a new `/src/app/(frontend)/lib/` directory for frontend-specific utilities
   - Moved frontend-specific types and utilities from `/src/lib/`:
     - `ideation-methods.ts`
     - `atoms.ts`
     - `utils.ts`
   - Added READMEs in both lib directories explaining their purpose and usage

3. **Import Paths**:

   - Updated import paths throughout the codebase to reflect the new structure
   - Standardized naming conventions and import paths

4. **Organization**:
   - Payload (admin/backend) components remain in `/src/app/(payload)/components/`
   - Feature-specific components are grouped in appropriate subdirectories

## Component Organization

The current structure follows this pattern:

```
src/
├── app/
│   ├── (frontend)/
│   │   ├── components/       # All frontend UI components
│   │   │   ├── ui/           # Reusable UI primitives
│   │   │   ├── ideation/     # Feature-specific components
│   │   │   ├── AtomSidebar/  # Feature-specific components
│   │   │   └── ...
│   │   ├── lib/              # Frontend-specific utilities
│   │   │   ├── atoms.ts      # Atom types and utilities
│   │   │   ├── ideation-methods.ts
│   │   │   ├── utils.ts      # Shared frontend utilities
│   │   │   └── index.ts      # Export all types and utilities
│   │   ├── actions/          # Server actions
│   │   └── ...
│   ├── (payload)/
│   │   ├── components/       # Admin components
│   │   └── ...
├── lib/                      # Shared utilities (frontend & backend)
```

## Benefits

- Clear separation between frontend and backend components
- Easier to understand component and utility organization
- More consistent import paths
- Better alignment with Next.js App Router conventions
- Enhanced maintainability
- Reduced duplication and overlap
