'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getSourceById } from '../../lib/data/sourcesData'
import { SourceItem } from '../../lib/types'

export default function SourceDetailPage() {
  const { id } = useParams()
  const [source, setSource] = useState<SourceItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSource = async () => {
      if (!id) return

      setIsLoading(true)
      try {
        const sourceId = Array.isArray(id) ? id[0] : id
        const data = await getSourceById(sourceId)
        setSource(data)
      } catch (error) {
        console.error(`Error loading source ${id}:`, error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSource()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
      </div>
    )
  }

  if (!source) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold">Source Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            The source you are looking for could not be found.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="rounded-lg border border-purple-200 bg-card p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold">{source.title}</h1>

        {source.author && <p className="mb-4 text-muted-foreground">By {source.author}</p>}

        {source.url && (
          <div className="mb-6">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline hover:text-blue-800"
            >
              {source.url}
            </a>
          </div>
        )}

        {source.description && (
          <div className="mb-6 rounded-md bg-muted p-4">
            <h3 className="mb-2 text-sm font-semibold uppercase">Summary</h3>
            <p>{source.description}</p>
          </div>
        )}

        {/* Additional source information would go here */}
        <div className="mt-4 flex flex-col gap-2">
          <h3 className="text-sm font-semibold uppercase">Source Information</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">ID</div>
            <div>{source.id}</div>
            <div className="text-muted-foreground">Type</div>
            <div>Source Document</div>
          </div>
        </div>
      </div>
    </div>
  )
}
