import { ConceptGraphContainer } from '@/app/(frontend)/components/ConceptGraph/ConceptGraphContainer'
import { Suspense } from 'react'

export default function HomePage({ searchParams }: any) {
  // Extract atom parameters with shorter names
  // v = vector id (pineconeId), a = atom id, t = type (s = synthesized)
  const getParam = (param: string): string | undefined => {
    const value = searchParams[param]
    return typeof value === 'string' ? value : Array.isArray(value) ? value[0] : undefined
  }

  const vectorId = getParam('v')
  const atomId = getParam('a')
  const type = getParam('t')

  // Determine collection from type parameter (s = synthesizedAtoms, otherwise atoms)
  const collection = type === 's' ? 'synthesizedAtoms' : 'atoms'

  return (
    <div className="flex h-screen">
      <main className="flex-1 p-4 overflow-auto">
        {/* Concept Graph */}
        <div className="overflow-hidden bg-white dark:bg-slate-900 mb-2">
          <Suspense fallback={<div className="p-4">Loading concept graph...</div>}>
            <ConceptGraphContainer
              initialAtomId={atomId}
              initialPineconeId={vectorId}
              initialCollection={collection}
            />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
