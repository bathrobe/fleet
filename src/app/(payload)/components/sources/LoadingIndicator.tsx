'use client'

import React, { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

// Define the ProcessingStage type locally
type ProcessingStage =
  | 'LLM_PROCESSING'
  | 'SOURCE_CREATION'
  | 'EMBEDDING'
  | 'ATOM_EXTRACTION'
  | 'COMPLETION'
  | 'source'
  | 'atoms'
  | null

interface LoadingIndicatorProps {
  isProcessing: boolean
  stage?: ProcessingStage
}

export const LoadingIndicator = ({ isProcessing, stage }: LoadingIndicatorProps) => {
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('Processing content...')

  // Update message and progress based on stage
  useEffect(() => {
    if (!isProcessing) {
      setProgress(0)
      return
    }

    switch (stage) {
      case 'LLM_PROCESSING':
        setMessage('Analyzing content with Claude...')
        setProgress(25)
        break
      case 'SOURCE_CREATION':
        setMessage('Creating source...')
        setProgress(50)
        break
      case 'EMBEDDING':
        setMessage('Generating embeddings...')
        setProgress(75)
        break
      case 'ATOM_EXTRACTION':
        setMessage('Extracting atomic concepts...')
        setProgress(85)
        break
      case 'COMPLETION':
        setMessage('Finalizing...')
        setProgress(100)
        break
      case 'source':
        setMessage('Processing source...')
        setProgress(30)
        break
      case 'atoms':
        setMessage('Extracting concepts...')
        setProgress(70)
        break
      default:
        setMessage('Processing...')
        setProgress(10)
    }
  }, [isProcessing, stage])

  if (!isProcessing) return null

  return (
    <div className="my-8 p-6 bg-muted rounded-lg text-card-foreground">
      <div className="flex items-center gap-3 mb-4">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <h3 className="font-medium">{message}</h3>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-muted-foreground/20 rounded-full h-2.5">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  )
}
