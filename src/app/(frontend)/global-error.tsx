'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error occurred:', error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
          <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
          <p className="text-lg mb-8">
            An unexpected error has occurred. Our team has been notified.
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
