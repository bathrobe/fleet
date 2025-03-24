import React from 'react'
import type { ReducedVectorData } from '../dimensionReducer'

type DataPointProps = {
  x: number
  y: number
  size: number
  color: string
  opacity: number
  isSelected: boolean
  data: ReducedVectorData
  onClick: () => void
  onHover?: (event: React.MouseEvent | React.TouchEvent) => void
  onLeave?: () => void
}

export const DataPoint = ({
  x,
  y,
  size,
  color,
  opacity,
  isSelected,
  onClick,
  onHover,
  onLeave,
}: DataPointProps) => {
  return (
    <circle
      cx={x}
      cy={y}
      r={size}
      fill={color}
      fillOpacity={opacity}
      stroke={isSelected ? '#ff4040' : '#fff'}
      strokeWidth={isSelected ? 2 : 1}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{ cursor: 'pointer' }}
    />
  )
}
