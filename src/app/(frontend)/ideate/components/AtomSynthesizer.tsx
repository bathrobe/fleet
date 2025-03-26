'use client'

import { useState } from 'react'
import { Button } from '@/app/(frontend)/ui/button'
import { SynthesizedAtomCard } from '@/app/(frontend)/ideate/components/SynthesizedAtomCard'
import { Atom } from '@/app/(frontend)/lib/atoms'
import { synthesizeAtoms } from '@/app/(frontend)/actions'

type AtomSynthesizerProps = {
  firstAtom: Atom
  secondAtom: Atom
  onFocusParentAtom?: (atomId: string, pineconeId: string, collection: string) => void
}

export function AtomSynthesizer({
  firstAtom,
  secondAtom,
  onFocusParentAtom,
}: AtomSynthesizerProps) {
  const [synthesizedAtom, setSynthesizedAtom] = useState<Atom | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSynthesize = async () => {
    if (!firstAtom || !secondAtom) return

    setLoading(true)
    setError(null)

    try {
      const result = await synthesizeAtoms(firstAtom, secondAtom)
      setSynthesizedAtom(result.combinedAtom)
    } catch (err: any) {
      console.error('Error synthesizing atoms:', err)
      setError(err.message || 'Failed to generate a synthesized concept. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Synthesize Concepts</h3>
        <Button
          onClick={handleSynthesize}
          disabled={loading || !firstAtom || !secondAtom}
          variant="outline"
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-0 hover:opacity-90"
        >
          {loading ? 'Generating...' : 'Create Synthesis'}
        </Button>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
        Click the button to generate a new concept that synthesizes the two atoms above using AI.
      </p>

      {error && (
        <div className="p-4 mb-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md">
          {error}
        </div>
      )}

      {synthesizedAtom && (
        <div className="mt-6">
          <SynthesizedAtomCard atom={synthesizedAtom} onFocusParentAtom={onFocusParentAtom} />
        </div>
      )}
    </div>
  )
}
