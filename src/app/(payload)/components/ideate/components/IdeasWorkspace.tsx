'use client'

import { useState, useEffect } from 'react'
import { DualDissimilarAtoms } from './IdeationMethods/DualDissimilarAtoms'
import { SynthesisMethodSelect } from './SynthesisMethodSelect'
import { useSynthesisMethods } from '../lib/hooks'
import { SynthesisMethod } from '../actions/synthesisMethods'

export function IdeasWorkspace() {
  const { methods, loading: methodsLoading } = useSynthesisMethods()
  const [selectedMethod, setSelectedMethod] = useState<SynthesisMethod | null>(null)

  // Set the first method as selected when methods load
  useEffect(() => {
    if (methods.length > 0 && !selectedMethod) {
      setSelectedMethod(methods[0])
    }
  }, [methods, selectedMethod])

  // Function to navigate to the graph view and focus on a specific atom
  const handleFocusOnAtom = (atomId: string, pineconeId: string, collection: string) => {
    console.log(`Focus on atom: ${atomId}, ${pineconeId}, ${collection}`)
  }

  return (
    <div className="space-y-6">
      {/* Header with method selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="mb-3 sm:mb-0">
          <h2 className="text-base font-medium tracking-tight">Synthesis Method</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedMethod?.description || 'Select a method to synthesize atoms'}
          </p>
        </div>

        <div className="flex-shrink-0">
          <SynthesisMethodSelect
            methods={methods}
            selectedMethod={selectedMethod}
            onMethodChange={setSelectedMethod}
            loading={methodsLoading}
          />
        </div>
      </div>

      {/* Ideation method content */}
      <div className="pt-2">
        {/* We're only rendering the dual-dissimilar component for now, but checking the methodKey */}
        {selectedMethod && selectedMethod.methodKey === 'dual-dissimilar' && (
          <DualDissimilarAtoms
            synthesisMethod={selectedMethod}
            onFocusParentAtom={handleFocusOnAtom}
          />
        )}
        {!selectedMethod && (
          <div className="p-6 text-center text-muted-foreground">
            Please select a synthesis method from the dropdown above to begin.
          </div>
        )}
      </div>
    </div>
  )
}
