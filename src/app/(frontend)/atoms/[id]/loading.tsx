import React from 'react'

export default function AtomLoading() {
  return (
    <div className="mx-auto max-w-3xl p-4 animate-pulse">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        {/* Title placeholder */}
        <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 mb-6 rounded"></div>

        {/* Main content placeholder */}
        <div className="mb-6 rounded-md bg-muted p-4">
          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 mb-4 rounded"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 mb-2 rounded"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 mb-2 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Supporting quote placeholder */}
        <div className="mb-6">
          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 mb-4 rounded"></div>
          <div className="border-l-4 border-gray-300 pl-4">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 mb-2 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>

        {/* Source placeholder */}
        <div className="mb-6">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 mb-4 rounded"></div>
          <div className="rounded-md bg-muted p-3">
            <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 mb-2 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 mb-2 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>

        {/* Atom information placeholder */}
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
