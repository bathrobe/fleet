'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error component encountered an error:', error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
      <h2 className="text-3xl font-bold mb-4">Something went wrong</h2>
      <p className="text-lg mb-8">An error occurred while loading this page. Please try again.</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
