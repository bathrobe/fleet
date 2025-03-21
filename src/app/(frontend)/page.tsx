import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { ConceptGraphContainer } from './components/ConceptGraph/ConceptGraphContainer'

export default async function HomePage() {
  const payload = await getPayload({ config, importMap: {} })
  const { docs: sources } = await payload.find({
    collection: 'sources',
    sort: '-createdAt',
  })

  return (
    <div className="flex h-screen">
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-4">Concept Vector Explorer</h1>
        <div className="border rounded-lg overflow-hidden bg-white dark:bg-slate-900 mb-6">
          <ConceptGraphContainer />
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">About the Sources Library</h2>
          <p className="text-gray-600 dark:text-gray-400">
            This visualization shows the relationships between concept vectors in your knowledge
            base.
          </p>
        </div>
      </main>
    </div>
  )
}
