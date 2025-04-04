'use client'

import { useState } from 'react'
import { Button } from '@/app/ui/button'
import { SynthesizedAtomCard } from './SynthesizedAtomCard'
import { Atom, synthesizeAtoms, saveSynthesizedAtom } from '../actions/synthesize'
import { Sparkles, Save, CheckCircle } from 'lucide-react'
import { SynthesisMethod } from '../actions/synthesisMethods'

type AtomSynthesizerProps = {
  firstAtom: Atom
  secondAtom: Atom
  synthesisMethod: SynthesisMethod | null
  onFocusParentAtom?: (atomId: string, pineconeId: string, collection: string) => void
}

export function AtomSynthesizer({
  firstAtom,
  secondAtom,
  synthesisMethod,
  onFocusParentAtom,
}: AtomSynthesizerProps) {
  const [synthesizedAtom, setSynthesizedAtom] = useState<Atom | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleSynthesize = async () => {
    if (!synthesisMethod) {
      setError('Please select a synthesis method before proceeding')
      return
    }

    setLoading(true)
    setError(null)
    setSaved(false)
    setSaveError(null)

    try {
      const result = await synthesizeAtoms(firstAtom, secondAtom)
      setSynthesizedAtom(result.combinedAtom)
    } catch (err: any) {
      setError(err.message || 'Failed to generate a synthesized concept. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAtom = async () => {
    if (!synthesizedAtom || !synthesisMethod) {
      setSaveError('Synthesis method is required')
      return
    }

    setSaving(true)
    setSaveError(null)

    try {
      const savedAtom = await saveSynthesizedAtom(synthesizedAtom, synthesisMethod.id)
      setSaved(true)

      setSynthesizedAtom({
        ...synthesizedAtom,
        id: String(savedAtom.id),
        pineconeId: savedAtom.pineconeId || undefined,
      })
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save the synthesized concept. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium tracking-tight">Synthesize Concepts</h3>
        <Button
          onClick={handleSynthesize}
          disabled={loading || !synthesisMethod}
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
        {!synthesisMethod && (
          <span className="text-yellow-500 ml-1">Select a synthesis method first.</span>
        )}
      </p>

      {error && (
        <div className="p-3 mb-4 bg-destructive/10 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      {synthesizedAtom && (
        <div className="mt-6">
          <SynthesizedAtomCard atom={synthesizedAtom} onFocusParentAtom={onFocusParentAtom} />

          {!saved ? (
            <div className="mt-4 flex justify-center">
              <Button
                onClick={handleSaveAtom}
                disabled={saving || !synthesisMethod}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {saving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save to Database
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="mt-4 flex justify-center">
              <div className="flex items-center text-green-600 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-md">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Saved successfully</span>
              </div>
            </div>
          )}

          {saveError && (
            <div className="p-3 mt-4 bg-destructive/10 text-destructive rounded-md text-sm">
              {saveError}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
