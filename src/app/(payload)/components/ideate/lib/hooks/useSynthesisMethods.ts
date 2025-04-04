'use client'

import { useState, useEffect } from 'react'
import { getSynthesisMethods, SynthesisMethod } from '../../actions/synthesisMethods'

export const useSynthesisMethods = () => {
  const [methods, setMethods] = useState<SynthesisMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        setLoading(true)
        const data = await getSynthesisMethods()
        setMethods(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching synthesis methods:', err)
        setError('Failed to load synthesis methods')
      } finally {
        setLoading(false)
      }
    }

    fetchMethods()
  }, [])

  return { methods, loading, error }
}
