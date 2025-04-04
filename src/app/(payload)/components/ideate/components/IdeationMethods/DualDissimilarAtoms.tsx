'use client'

import { useState } from 'react'
import { Button } from '@/app/ui/button'
import { SimpleAtomCard } from '../SimpleAtomCard'
import { AtomSynthesizer } from '../AtomSynthesizer'
import { getRandomAtomPair } from '../../actions'
import { Atom } from '../../actions/synthesize'
import { Sparkles } from 'lucide-react'
import { SynthesisMethod } from '../../actions/synthesisMethods'

// Updated to match the actual return type from getRandomAtomPair
type AtomPairResponse = {
  firstAtom: Atom
  secondAtom: Atom | null
  method: string
}

type DualDissimilarAtomsProps = {
  synthesisMethod: SynthesisMethod | null
  onFocusParentAtom?: (atomId: string, pineconeId: string, collection: string) => void
}

export function DualDissimilarAtoms({
  synthesisMethod,
  onFocusParentAtom,
}: DualDissimilarAtomsProps) {
  const [atoms, setAtoms] = useState<AtomPairResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchAtoms = async () => {
    setLoading(true)
    try {
      const result = await getRandomAtomPair()
      // Convert to unknown first to avoid type error
      setAtoms(result as unknown as AtomPairResponse)
    } catch (error) {
      console.error('Error fetching atoms:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Button
          onClick={fetchAtoms}
          disabled={loading || !synthesisMethod}
          className="flex items-center gap-2"
          size="sm"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {loading ? 'Loading...' : 'Get Random Concepts'}
        </Button>

        {atoms?.method === 'vector' && (
          <span className="text-xs text-muted-foreground italic">Using vector similarity</span>
        )}
      </div>

      {atoms && (
        <div>
          {atoms.method === 'vector' && (
            <p className="mb-4 text-sm text-muted-foreground">
              The second concept is among the most dissimilar to the first one.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <SimpleAtomCard atom={atoms.firstAtom} />
            {atoms.secondAtom && <SimpleAtomCard atom={atoms.secondAtom} />}
          </div>

          {atoms.firstAtom && atoms.secondAtom && (
            <AtomSynthesizer
              firstAtom={atoms.firstAtom}
              secondAtom={atoms.secondAtom}
              synthesisMethod={synthesisMethod}
              onFocusParentAtom={onFocusParentAtom}
            />
          )}
        </div>
      )}
    </div>
  )
}
