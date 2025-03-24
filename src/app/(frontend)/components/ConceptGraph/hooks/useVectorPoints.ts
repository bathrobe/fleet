import { useMemo } from 'react'
import type { ReducedVectorData } from '../dimensionReducer'

type ScaleType = (value: number) => number

type Point = {
  id: string
  x: number
  y: number
  size: number
  color: string
  opacity: number
  data: ReducedVectorData
}

export const useVectorPoints = (
  reducedData: ReducedVectorData[],
  xScale: ScaleType,
  yScale: ScaleType,
  selectedId: string | null,
) => {
  return useMemo(() => {
    return reducedData.map((d) => ({
      id: d.id,
      x: xScale(d.position[0]),
      y: yScale(d.position[1]),
      size: d.metadata.text ? 8 : 6, // Larger size for visibility
      color: d.id === selectedId ? '#ff4040' : '#6a4dff', // Brighter colors
      opacity: selectedId && d.id !== selectedId ? 0.6 : 1.0, // Higher opacity
      data: d,
    }))
  }, [reducedData, xScale, yScale, selectedId])
}
