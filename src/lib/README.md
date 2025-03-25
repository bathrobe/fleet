# Shared Library Code

This directory is for shared code that is used across **both** frontend and backend components of the application.

For frontend-specific code, use the `src/app/(frontend)/lib` directory instead.

## When to Use This Directory

Code should be placed in this directory only if:

1. It needs to be shared between frontend and backend (Payload) components
2. It provides core functionality that is context-agnostic
3. It defines types or interfaces used across the entire application

## Examples of Appropriate Code

- Shared type definitions
- Core utility functions
- Configuration constants
- Shared API interfaces

## Structure

The structure of this directory should remain flat and simple, with clear file names indicating their purpose.
