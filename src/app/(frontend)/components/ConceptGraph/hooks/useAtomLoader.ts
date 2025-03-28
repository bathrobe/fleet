import { useState, useCallback } from 'react'
import { fetchAtomById } from '../fetchVectors'

export const useAtomLoader = () => {
  const [selectedAtomId, setSelectedAtomId] = useState<string | null>(null)
  const [atomData, setAtomData] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [atomType, setAtomType] = useState<'regular' | 'synthesized'>('regular')

  const loadAtomById = useCallback(async (pineconeId: string) => {
    if (!pineconeId) {
      setSelectedAtomId(null)
      setAtomData(null)
      return null
    }

    try {
      setIsLoading(true)
      const data = await fetchAtomById(pineconeId)

      if (data) {
        setAtomData(data)
        setSelectedAtomId(pineconeId)
        setAtomType(data.metadata?.type === 'synthesized' ? 'synthesized' : 'regular')
        console.log('Loaded atom data:', data)
      } else {
        console.warn('No atom data found for ID:', pineconeId)
        setAtomData(null)
      }

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
    atomType,
    isLoading,
    loadAtomById,
    clearSelection,
  }
}
