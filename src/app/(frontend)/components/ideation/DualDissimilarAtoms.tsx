'use client'

import { useState } from 'react'
import { Button } from '@/app/(frontend)/components/ui/button'
import { SimpleAtomCard } from '@/app/(frontend)/components/SimpleAtomCard'
import { Atom } from '@/app/(frontend)/lib/atoms'
import { AtomSynthesizer } from './synthesis/AtomSynthesizer'
import { getRandomAtomPair } from '@/app/(frontend)/actions'

type AtomPairResponse = {
  firstAtom: Atom
  secondAtom: Atom | null
  method: 'random' | 'vector' | 'random-fallback'
}

export function DualDissimilarAtoms() {
  const [atoms, setAtoms] = useState<AtomPairResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchAtoms = async () => {
    setLoading(true)
    try {
      const result = await getRandomAtomPair()
      setAtoms(result as AtomPairResponse)
    } catch (error) {
      console.error('Error fetching atoms:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Button onClick={fetchAtoms} disabled={loading}>
          {loading ? 'Loading...' : 'Get Random Concepts'}
        </Button>

        {atoms?.method === 'vector' && (
          <span className="text-sm text-gray-500 dark:text-gray-400 italic">
            Using vector similarity
          </span>
        )}
      </div>

      {atoms && (
        <div>
          {atoms.method === 'vector' && (
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              The second concept is among the most dissimilar to the first one.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SimpleAtomCard atom={atoms.firstAtom} />
            {atoms.secondAtom && <SimpleAtomCard atom={atoms.secondAtom} />}
          </div>

          {atoms.firstAtom && atoms.secondAtom && (
            <AtomSynthesizer firstAtom={atoms.firstAtom} secondAtom={atoms.secondAtom} />
          )}
        </div>
      )}
    </div>
  )
}
