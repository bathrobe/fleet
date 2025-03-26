import React from 'react'

export function GraphLegend() {
  return (
    <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md z-10">
      <div className="text-xs font-medium mb-1">Atom Types</div>
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-1" />
          <span className="text-xs">Regular</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-emerald-500 mr-1" />
          <span className="text-xs">Synthesized</span>
        </div>
      </div>
    </div>
  )
}
