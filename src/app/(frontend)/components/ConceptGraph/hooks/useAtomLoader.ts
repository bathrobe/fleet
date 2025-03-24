import { useState, useCallback } from 'react'
import { fetchAtomById, AtomData } from '../fetchVectors'

export const useAtomLoader = () => {
  const [selectedAtomId, setSelectedAtomId] = useState<string | null>(null)
  const [atomData, setAtomData] = useState<AtomData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const loadAtomById = useCallback(async (pineconeId: string) => {
    if (!pineconeId) {
      setSelectedAtomId(null)
      setAtomData(null)
      return null
    }

    try {
      setIsLoading(true)
      const data = await fetchAtomById(pineconeId)
      setAtomData(data)
      setSelectedAtomId(pineconeId)
      return data
    } catch (error) {
      console.error('Error loading atom data:', error)
      setAtomData(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedAtomId(null)
    setAtomData(null)
  }, [])

  return {
    selectedAtomId,
    atomData,
    isLoading,
    loadAtomById,
    clearSelection,
  }
}
