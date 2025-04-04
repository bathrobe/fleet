'use client'

import { useState, useEffect } from 'react'
import { SecondaryCollectionSidebar } from '../components/collections/SecondaryCollectionSidebar'
import { getAtoms } from '../actions/atoms'
import { AtomItem } from '../lib/types'

export default function AtomsLayout({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<AtomItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  async function loadData() {
    setIsLoading(true)
    try {
      const result = await getAtoms(100, 1)
      console.log('Atoms API result:', result)

      if (!result || !result.docs) {
        console.error('Invalid response format:', result)
        return
      }

      const mappedItems = result.docs.map((atom) => ({
        id: atom.id,
        title: atom.title || `Atom ${atom.id}`,
        description: atom.mainContent
          ? typeof atom.mainContent === 'string'
            ? atom.mainContent.substring(0, 100) + '...'
            : 'Complex content'
          : 'No description',
      }))

      setItems(mappedItems)
    } catch (error) {
      console.error('Error loading atoms:', error)
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
        title="Atoms"
        items={items}
        basePath="/atoms"
        isLoading={isLoading}
        emptyStateText="No atoms found in database"
        onSearch={handleSearch}
      />
      <div className="flex-1 flex flex-col overflow-auto">{children}</div>
    </div>
  )
}
