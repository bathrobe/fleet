import React from 'react'
import type { ReducedVectorData } from '../dimensionReducer'

type DataTooltipProps = {
  data: ReducedVectorData
  left: number | undefined
  top: number | undefined
}

export const DataTooltip = ({ data, left, top }: DataTooltipProps) => {
  if (!left || !top) return null

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        transform: 'translate(-50%, -100%)',
        pointerEvents: 'none',
      }}
    >
      <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-lg border border-gray-200 dark:border-gray-700 text-sm">
        <div className="max-w-xs">
          <div className="font-medium">
            {data.metadata.text
              ? data.metadata.text?.substring(0, 50) +
                (data.metadata.text && data.metadata.text.length > 50 ? '...' : '')
              : data.id}
          </div>
          <div className="text-xs text-gray-500 mt-1">ID: {data.id}</div>
        </div>
      </div>
    </div>
  )
}
