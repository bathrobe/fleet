'use client'

import { useState, useEffect } from 'react'
import { SecondaryCollectionSidebar } from '../components/collections/SecondaryCollectionSidebar'
import { getSources } from '../actions/atoms' // Use the correct sources action
import { SourceItem } from '../lib/types'

export default function SourcesLayout({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<SourceItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Function to load data
  async function loadData() {
    setIsLoading(true)
    try {
      // Call the real Payload API for sources
      const result = await getSources(100, 1) // Get up to 100 sources
      console.log('Sources API result:', result) // Debug log

      if (!result || !result.docs) {
        console.error('Invalid response format:', result)
        return
      }

      // Map the payload data to the format expected by the sidebar
      const mappedItems = result.docs.map((source) => {
        // Extract category information if available
        let categoryInfo = ''
        if (source.sourceCategory) {
          if (typeof source.sourceCategory === 'object' && source.sourceCategory.title) {
            categoryInfo = `Category: ${source.sourceCategory.title}`
          } else if (
            typeof source.sourceCategory === 'string' ||
            typeof source.sourceCategory === 'number'
          ) {
            categoryInfo = 'Categorized'
          }
        }

        // Just show the author
        const description = source.author ? `By ${source.author}` : ''

        return {
          id: source.id,
          title: source.title || `Source ${source.id}`,
          description: description || 'No author specified',
          // Add optional badge for the category
          metadata: source.sourceCategory
            ? {
                category:
                  typeof source.sourceCategory === 'object' && source.sourceCategory.title
                    ? source.sourceCategory.title
                    : 'Categorized',
              }
            : undefined,
        }
      })

      setItems(mappedItems)
    } catch (error) {
      console.error('Error loading sources:', error)
      setItems([]) // Clear items on error
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Client-side search
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
        title="Sources"
        items={items}
        basePath="/sources"
        isLoading={isLoading}
        emptyStateText="No sources found in database"
        onSearch={handleSearch}
      />
      <div className="flex-1 flex flex-col overflow-auto">{children}</div>
    </div>
  )
}
