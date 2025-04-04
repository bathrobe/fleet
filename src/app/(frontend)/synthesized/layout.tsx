'use client'

import { useState, useEffect } from 'react'
import { SecondaryCollectionSidebar } from '../components/collections/SecondaryCollectionSidebar'
import { getSynthesizedAtoms } from '../actions/atoms'
import { SyntheticAtomItem } from '../lib/types'

export default function SynthesizedAtomsLayout({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<SyntheticAtomItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  async function loadData() {
    setIsLoading(true)
    try {
      const result = await getSynthesizedAtoms(100, 1)
      console.log('Synthesized atoms API result:', result)

      if (!result || !result.docs) {
        console.error('Invalid response format:', result)
        return
      }

      const mappedItems = result.docs.map((atom) => ({
        id: atom.id,
        title: atom.title || `Synthesized Atom ${atom.id}`,
        description: atom.mainContent
          ? typeof atom.mainContent === 'string'
            ? atom.mainContent.substring(0, 100) + '...'
            : 'Complex content'
          : 'No description',
      }))

      setItems(mappedItems)
    } catch (error) {
      console.error('Error loading synthesized atoms:', error)
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSearch = (query: string) => {
    if (!query) {
      loadData()
      return
    }

    const filteredItems = items.filter(
      (item) =>
        (item.title?.toLowerCase() || '').includes(query.toLowerCase()) ||
        (item.description?.toLowerCase() || '').includes(query.toLowerCase()),
    )

    setItems(filteredItems)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SecondaryCollectionSidebar
        title="Synthesized Atoms"
        items={items}
        basePath="/synthesized"
        isLoading={isLoading}
        emptyStateText="No synthesized atoms found in database"
        onSearch={handleSearch}
      />
      <div className="flex-1 flex flex-col overflow-auto">{children}</div>
    </div>
  )
}
