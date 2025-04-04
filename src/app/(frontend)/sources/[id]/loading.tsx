import React from 'react'

export default function SourceLoading() {
  return (
    <div className="mx-auto max-w-3xl p-4 animate-pulse">
      <div className="rounded-lg border border-purple-200 bg-card p-6 shadow-sm">
        {/* Title placeholder */}
        <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 mb-2 rounded"></div>

        {/* Author placeholder */}
        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 mb-6 rounded"></div>

        {/* URL placeholder */}
        <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 mb-6 rounded"></div>

        {/* Summary placeholder */}
        <div className="mb-6 rounded-md bg-muted p-4">
          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 mb-4 rounded"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 mb-2 rounded"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 mb-2 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Main Points placeholder */}
        <div className="mb-6">
          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 mb-4 rounded"></div>
          <div className="ml-6 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>

        {/* Related Atoms placeholder */}
        <div className="mb-6">
          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 mb-4 rounded"></div>
          <div className="grid gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-md bg-gray-100 dark:bg-gray-800 p-3">
                <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 mb-2 rounded"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Source information placeholder */}
        <div className="mt-6 flex flex-col gap-2 border-t pt-4">
          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 mb-4 rounded"></div>
          <div className="grid grid-cols-2 gap-y-2">
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
