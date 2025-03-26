import { ConceptGraphContainer } from '@/app/(frontend)/components/ConceptGraph/ConceptGraphContainer'

export default async function HomePage() {
  // const payload = await getPayload({ config, importMap: {} })
  // const { docs: sources } = await payload.find({
  //   collection: 'sources',
  //   sort: '-createdAt',
  // })

  return (
    <div className="flex h-screen">
      <main className="flex-1 p-4 overflow-auto">
        {/* Concept Graph */}
        <div className="overflow-hidden bg-white dark:bg-slate-900 mb-2">
          <ConceptGraphContainer />
        </div>
      </main>
    </div>
  )
}
