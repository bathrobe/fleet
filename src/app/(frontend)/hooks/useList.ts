'use client'

import { useState, useEffect } from 'react'

type UseListResult<T> = {
  items: T[]
  loading: boolean
  error: Error | null
}

export const useList = <T>(collection: string): UseListResult<T> => {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/${collection}?limit=100&depth=0`)
        const data = await response.json()
        setItems(data.docs || [])
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch data'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [collection])

  return { items, loading, error }
}
