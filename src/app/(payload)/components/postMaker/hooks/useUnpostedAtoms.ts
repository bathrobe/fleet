'use client'

import { useState, useEffect } from 'react'
import { fetchUnpostedAtoms } from '../actions/fetchUnpostedAtoms'
import type { SynthesizedAtom } from '../types'

export function useUnpostedAtoms() {
  const [atoms, setAtoms] = useState<SynthesizedAtom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAtoms = async () => {
      try {
        setLoading(true)
        setError(null)

        const result = await fetchUnpostedAtoms()
        setAtoms(result)
      } catch (err) {
        console.error('Error fetching unposted atoms:', err)
        setError('Failed to load unposted atoms')
      } finally {
        setLoading(false)
      }
    }

    loadAtoms()
  }, [])

  return { atoms, loading, error }
}
