'use client'

/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react'
import { AtomData } from '../../components/ConceptGraph/fetchVectors'
import { Separator } from '../../../ui/separator'
import { cn } from '@/app/(frontend)/lib/utils'
import { BookOpen, Quote, Info, Link, ChevronDown, ChevronUp, Atom } from 'lucide-react'
import { SourceCard } from './SourceCard'

type DetailedAtomCardProps = {
  atom: AtomData | null
  loading?: boolean
  className?: string
  onClose?: () => void
  position?: number[]
  vectorId?: string
}

export function DetailedAtomCard({
  atom,
  loading = false,
  className,
  onClose,
  position,
  vectorId,
}: DetailedAtomCardProps) {
  const [showSourceDetails, setShowSourceDetails] = useState(false)

  const toggleSourceDetails = () => {
    setShowSourceDetails(!showSourceDetails)
  }

  if (loading) {
    return (
      <div
        className={cn(
          'w-full h-full flex items-center justify-center bg-white dark:bg-gray-900',
          className,
        )}
      >
        <div className="flex flex-col items-center text-gray-500">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-gray-200 animate-spin mb-4"></div>
          <p>Loading atom data...</p>
        </div>
      </div>
    )
  }

  if (!atom) {
    return (
      <div
        className={cn(
          'w-full h-full flex items-center justify-center bg-white dark:bg-gray-900',
          className,
        )}
      >
        <div className="text-center text-gray-500 max-w-md p-6">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium">No atom data available</h3>
          <p className="mt-1 text-sm">The selected node doesn't have any associated atom data.</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-white dark:bg-gray-900 border-2 border-blue-500 dark:border-blue-700 rounded-lg shadow-sm',
        className,
      )}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-blue-500 dark:border-blue-700 flex justify-between items-center bg-blue-50 dark:bg-blue-950">
        <div>
          <div className="flex items-center">
            <Atom className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white leading-tight">
              {atom.title || 'Atomic Concept'}
            </h2>
          </div>
          {atom.source && (
            <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <BookOpen className="mr-1 h-4 w-4" />
              <span>From: {atom.source.title || `Unknown source`}</span>
            </div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-2 flex-shrink-0"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Content - make sure it fills available space */}
      <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
        {/* Main Content */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
            Main Concept
          </h3>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 text-gray-800 dark:text-gray-200">
            {atom.mainContent || 'No main content available'}
          </div>
        </div>

        {/* Supporting Quote */}
        {atom.supportingQuote && (
          <div className="space-y-2">
            <div className="flex items-center">
              <Quote className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                Supporting Quote
              </h3>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-l-4 border-blue-400 dark:border-blue-600 text-gray-800 dark:text-gray-200 italic">
              &ldquo;{atom.supportingQuote}&rdquo;
            </div>
          </div>
        )}

        {/* Supporting Info */}
        {atom.supportingInfo && atom.supportingInfo.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                Supporting Information
              </h3>
            </div>
            <div className="space-y-2">
              {atom.supportingInfo.map((info, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg text-gray-800 dark:text-gray-200 text-sm"
                >
                  {info.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Source Link */}
        {atom.source && (
          <div className="pt-2">
            <Separator className="mb-3" />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                  Source
                </h3>
                {atom.source.title && (
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                    {atom.source.title}
                  </span>
                )}
              </div>
              <button
                onClick={toggleSourceDetails}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                {showSourceDetails ? (
                  <>
                    Hide Details <ChevronUp className="ml-1 h-4 w-4" />
                  </>
                ) : (
                  <>
                    View Details <ChevronDown className="ml-1 h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            {showSourceDetails && (
              <div className="mt-5 mb-2">
                <SourceCard source={atom.source} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
