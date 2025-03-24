'use client'

import { useState } from 'react'
import { IdeationMethodSelect } from '@/components/IdeationMethodSelect'
import { DualDissimilarAtoms } from '@/components/ideation/DualDissimilarAtoms'
import { getDefaultMethod, IdeationMethod } from '@/lib/ideation-methods'

export function IdeasWorkspace() {
  const [selectedMethod, setSelectedMethod] = useState<IdeationMethod>(getDefaultMethod())

  return (
    <div className="space-y-6">
      {/* Header with method selection */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between pb-4 border-b">
        <div>
          <h2 className="text-xl font-semibold">Ideation Method</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {selectedMethod.description}
          </p>
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
        {selectedMethod.id === 'dual-dissimilar' && <DualDissimilarAtoms />}
        {/* Additional methods will be added here as they are implemented */}
      </div>
    </div>
  )
}
