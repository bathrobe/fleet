import { Button } from '@/components/ui/button'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { SourcesSidebar } from './components/SourcesSidebar'

export default async function HomePage() {
  const payload = await getPayload({ config, importMap: {} })
  const { docs: sources } = await payload.find({
    collection: 'sources',
    sort: '-createdAt',
  })

  return (
    <div className="flex h-screen">
      <SourcesSidebar sources={sources} />
      <main className="flex-1 p-6">
        <Button>Click me</Button>
        <h1 className="text-3xl font-bold mb-4">Welcome to the Sources Library</h1>
        <p className="text-gray-600">Select a source from the sidebar to view its details.</p>
      </main>
    </div>
  )
}
