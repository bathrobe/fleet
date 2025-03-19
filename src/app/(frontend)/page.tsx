import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { SourcesSidebar } from './components/SourcesSidebar'
import './styles.css'

export default async function HomePage() {
  const payload = await getPayload({ config, importMap: {} })
  const { docs: sources } = await payload.find({
    collection: 'sources',
    sort: '-createdAt',
  })

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '300px', height: '100%' }}>
        <SourcesSidebar sources={sources} />
      </div>
      <main style={{ flex: 1, padding: '1.5rem' }}>
        <h1>Welcome to the Sources Library</h1>
        <p>Select a source from the sidebar to view its details.</p>
      </main>
    </div>
  )
}
