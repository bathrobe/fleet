import { useMemo } from 'react'
import { scaleLinear } from '@visx/scale'

type Bounds = {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}

export const useVectorScales = (bounds: Bounds, width: number, height: number) => {
  // Create scales - ensure equal scaling on both axes for dimensional accuracy
  const xScale = useMemo(() => {
    const size = Math.max(Math.abs(bounds.xMax - bounds.xMin), Math.abs(bounds.yMax - bounds.yMin))
    const midX = (bounds.xMax + bounds.xMin) / 2

    return scaleLinear<number>({
      domain: [midX - size / 2, midX + size / 2],
      range: [0, width],
    })
  }, [bounds, width])

  const yScale = useMemo(() => {
    const size = Math.max(Math.abs(bounds.xMax - bounds.xMin), Math.abs(bounds.yMax - bounds.yMin))
    const midY = (bounds.yMax + bounds.yMin) / 2

    return scaleLinear<number>({
      domain: [midY - size / 2, midY + size / 2],
      range: [height, 0], // Inverted for SVG
    })
  }, [bounds, height])

  return { xScale, yScale }
}
