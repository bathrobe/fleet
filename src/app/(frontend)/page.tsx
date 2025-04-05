'use client'

import { useState, useEffect } from 'react'
import { SecondaryCollectionSidebar } from './components/collections/SecondaryCollectionSidebar'
import { getSynthesizedAtoms } from './actions/atoms' // Use the real server action

interface ItemType {
  id: string | number
  title: string
  description: string
}

// @ts-ignore
export default function SynthesizedAtomsLayout({ children }: any) {
  const [items, setItems] = useState<ItemType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Call the real Payload API
      const result = await getSynthesizedAtoms(100, 1) // Get up to 100 items
      console.log('Synthesized atoms API result:', result) // Log for debugging

      // Map to the format expected by the sidebar
      const mappedItems = result.docs.map((atom) => ({
        id: atom.id,
        title: atom.title || `Synthesized Atom ${atom.id}`,
        description: atom.mainContent?.substring(0, 100) || 'No description',
      }))

      setItems(mappedItems)
    } catch (error) {
      console.error('Error loading synthesized atoms:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Simple client-side search
  const handleSearch = (query: string) => {
    if (!query) {
      loadData()
      return
    }

    const filteredItems = items.filter(
      (item) =>
        item.title?.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase()),
    )

    setItems(filteredItems)
  }

  return (
    <div className="flex h-full">
      <SecondaryCollectionSidebar
        title="Synthesized Atoms"
        items={items}
        basePath="/synthesized"
        isLoading={isLoading}
        emptyStateText="No synthesized atoms found in database"
        onSearch={handleSearch}
      />
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  )
}
