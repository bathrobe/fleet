'use client'

import { ConceptGraphWithSidebar } from './ConceptGraphWithSidebar'
import { useVectorDataLoader } from './hooks/useVectorDataLoader'

type ConceptGraphContainerProps = {
  initialAtomId?: string
  initialPineconeId?: string
  initialCollection?: string
}

export function ConceptGraphContainer({
  initialAtomId,
  initialPineconeId,
  initialCollection,
}: ConceptGraphContainerProps = {}) {
  const { vectorData, reducedData, isLoading, error } = useVectorDataLoader()

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  if (isLoading) {
    return <div className="p-4">Loading concept graph...</div>
  }

  return (
    <ConceptGraphWithSidebar
      vectorData={vectorData}
      reducedData={reducedData}
      initialAtomId={initialAtomId}
      initialPineconeId={initialPineconeId}
      initialCollection={initialCollection}
    />
  )
}
