'use client'

import { useState } from 'react'
import { IdeationMethodSelect } from './IdeationMethodSelect'
import { DualDissimilarAtoms } from './IdeationMethods/DualDissimilarAtoms'
import { getDefaultMethod, IdeationMethod } from '../lib/ideation-methods'

export function IdeasWorkspace() {
  const [selectedMethod, setSelectedMethod] = useState<IdeationMethod>(getDefaultMethod())

  // Function to navigate to the graph view and focus on a specific atom
  const handleFocusOnAtom = (atomId: string, pineconeId: string, collection: string) => {
    // For admin, we'll just log this for now (or could open in new tab/window)
    console.log(`Focus on atom: ${atomId}, ${pineconeId}, ${collection}`)

    // Could open in new window:
    // window.open(`/admin/collections/atoms/${atomId}`, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Header with method selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="mb-3 sm:mb-0">
          <h2 className="text-base font-medium tracking-tight">Ideation Method</h2>
          <p className="text-sm text-muted-foreground mt-1">{selectedMethod.description}</p>
        </div>

        <div className="flex-shrink-0">
          <IdeationMethodSelect
            selectedMethod={selectedMethod}
            onMethodChange={setSelectedMethod}
          />
        </div>
      </div>

      {/* Ideation method content */}
      <div className="pt-2">
        {selectedMethod.id === 'dual-dissimilar' && (
          <DualDissimilarAtoms onFocusParentAtom={handleFocusOnAtom} />
        )}
        {/* Additional methods will be added here as they are implemented */}
      </div>
    </div>
  )
}
