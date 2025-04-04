'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getAtomById } from '../../lib/data/atomsData'
import { AtomItem } from '../../lib/types'

export default function AtomDetailPage() {
  const { id } = useParams()
  const [atom, setAtom] = useState<AtomItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAtom = async () => {
      if (!id) return

      setIsLoading(true)
      try {
        const atomId = Array.isArray(id) ? id[0] : id
        const data = await getAtomById(atomId)
        setAtom(data)
      } catch (error) {
        console.error(`Error loading atom ${id}:`, error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAtom()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
      </div>
    )
  }

  if (!atom) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold">Atom Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            The atom you are looking for could not be found.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-bold">{atom.title}</h1>

        <div className="mb-6 rounded-md bg-muted p-4">
          <h3 className="mb-2 text-sm font-semibold uppercase">Main Content</h3>
          <p>{atom.mainContent}</p>
        </div>

        {/* Additional atom information would go here */}
        <div className="mt-4 flex flex-col gap-2">
          <h3 className="text-sm font-semibold uppercase">Atom Information</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">ID</div>
            <div>{atom.id}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
