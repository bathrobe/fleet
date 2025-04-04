'use client'

import React from 'react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function SynthesizedAtomError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Synthesized atom error:', error)
  }, [error])

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="mb-6 text-muted-foreground">
          There was an error loading this synthesized atom. This could be due to a network issue or
          a problem with the data.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </button>
          <Link
            href="/synthesized"
            className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
          >
            Back to Synthesized Atoms
          </Link>
        </div>
      </div>
    </div>
  )
}
