'use client'

import { useState } from 'react'
import { Button } from '@/app/ui/button'
import { SynthesizedAtomCard } from './SynthesizedAtomCard'
import { Atom, synthesizeAtoms } from '../actions/synthesize'
import { Sparkles } from 'lucide-react'

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
    <div className="mt-8 pt-6 border-t border-border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium tracking-tight">Synthesize Concepts</h3>
        <Button
          onClick={handleSynthesize}
          disabled={loading || !firstAtom || !secondAtom}
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 hover:opacity-90"
        >
          <Sparkles className="h-3.5 w-3.5 mr-2" />
          {loading ? 'Generating...' : 'Create Synthesis'}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mb-4">
        Click the button to generate a new concept that synthesizes the two atoms above using AI.
      </p>

      {error && (
        <div className="p-3 mb-4 bg-destructive/10 text-destructive rounded-md text-sm">
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
