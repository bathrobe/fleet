import { useMemo } from 'react'
import type { ReducedVectorData } from '../dimensionReducer'

export const useDataBounds = (reducedData: ReducedVectorData[]) => {
  // Determine the bounds to properly display all data points
  return useMemo(() => {
    if (reducedData.length === 0) return { xMin: -1, xMax: 1, yMin: -1, yMax: 1 }

    let xMin = Infinity
    let xMax = -Infinity
    let yMin = Infinity
    let yMax = -Infinity

    reducedData.forEach((d) => {
      const x = d.position[0]
      const y = d.position[1]
      if (x < xMin) xMin = x
      if (x > xMax) xMax = x
      if (y < yMin) yMin = y
      if (y > yMax) yMax = y
    })

    // Add more generous padding (30%) to ensure points aren't at the edges
    const xPadding = Math.max(0.3, (xMax - xMin) * 0.3)
    const yPadding = Math.max(0.3, (yMax - yMin) * 0.3)

    return {
      xMin: xMin - xPadding,
      xMax: xMax + xPadding,
      yMin: yMin - yPadding,
      yMax: yMax + yPadding,
    }
  }, [reducedData])
}
