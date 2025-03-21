# Concept Graph Visualization

This directory contains components for visualizing concept vectors using dimensionality reduction techniques.

## Components

- **ConceptGraphContainer.tsx**: Server component that fetches vector data and reduces dimensions
- **ConceptGraphRenderer.tsx**: Client component that renders the visualization
- **dimensionReducer.ts**: Utility for reducing high-dimensional vectors to 2D using UMAP
- **fetchVectors.ts**: Server action to fetch vectors from Pinecone

## Data Flow

1. `ConceptGraphContainer` fetches vector data from Pinecone
2. The vectors are reduced to 2D using UMAP via `dimensionReducer`
3. Both original and reduced data are passed to `ConceptGraphRenderer`

## Data Structure

The `ReducedVectorData` type represents vector data with reduced dimensionality:

```typescript
type ReducedVectorData = {
  id: string
  position: number[] // 2D coordinates
  metadata: VectorData['metadata']
  originalVector: number[] // Original high-dimensional vector
}
```

## Next Steps

We need to implement a visualization that:

- Preserves a 1:1 aspect ratio to accurately show semantic distances
- Minimizes axis emphasis (semantic distances are what matter)
- Provides interactive features like zoom, pan, and selection
- Renders efficiently for potentially large numbers of vectors
