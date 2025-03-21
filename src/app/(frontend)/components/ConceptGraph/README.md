# Concept Graph Visualization

This directory contains components for visualizing concept vectors using dimensionality reduction techniques.

## Components

- **ConceptGraphContainer.tsx**: Server component that fetches vector data and reduces dimensions
- **ConceptGraphRenderer.tsx**: Client component that renders the visualization
- **ConceptVectorSpace.tsx**: Core visualization component using visx
- **dimensionReducer.ts**: Utility for reducing high-dimensional vectors to 2D using UMAP
- **fetchVectors.ts**: Server action to fetch vectors from Pinecone

## Data Flow

1. `ConceptGraphContainer` fetches vector data from Pinecone
2. The vectors are reduced to 2D using UMAP via `dimensionReducer`
3. Both original and reduced data are passed to `ConceptGraphRenderer`
4. `ConceptGraphRenderer` passes the reduced data to `ConceptVectorSpace` for visualization

## Visualization Features

- **1:1 Aspect Ratio**: Preserves accurate semantic distances between points
- **Minimal Axis Emphasis**: Focus on spatial relationships rather than axis values
- **Interactive Controls**:
  - Zoom with mouse wheel
  - Pan by dragging
  - Click points to view detailed metadata
  - Hover for quick tooltips
- **Visual Cues**:
  - Highlighted selected points
  - Size differentiation based on metadata presence
  - Opacity changes to emphasize selection

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

## Implementation Notes

The visualization is built using visx (from Airbnb), which provides:

- High performance rendering with SVG
- Functional API that aligns with React principles
- Precise control over visual elements
- Support for complex interactions like zoom and pan
