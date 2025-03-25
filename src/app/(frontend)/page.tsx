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
