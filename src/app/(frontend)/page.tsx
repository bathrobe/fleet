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
      <main className="flex-1 p-4 overflow-auto">
        <h1 className="text-3xl font-bold mb-2">Concept Vector Explorer</h1>

        {/* Clean container with no styling that would create visual gaps */}
        <div className="overflow-hidden bg-white dark:bg-slate-900 mb-2">
          <ConceptGraphContainer />
        </div>

        <div className="text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            This visualization shows the relationships between concept vectors in your knowledge
            base. Points that are closer together have greater semantic similarity.
          </p>
        </div>
      </main>
    </div>
  )
}
