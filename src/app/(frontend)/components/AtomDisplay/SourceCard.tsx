'use client'

import { Separator } from '../ui/separator'
import { cn } from '../utils/cn'
import { Calendar, User, Tag, ExternalLink } from 'lucide-react'

type SourceData = {
  id: string
  title?: string
  url?: string
  author?: string
  publishedDate?: string
  tags?: any[]
  oneSentenceSummary?: string
  mainPoints?: { text: string }[]
  bulletSummary?: { text: string }[]
  peopleplacesthingsevents?: { text: string }[]
  quotations?: { text: string }[]
  details?: { text: string }[]
  sourceCategory?: any
}

type SourceCardProps = {
  source: SourceData
  className?: string
  onClose?: () => void
}

export function SourceCard({ source, className, onClose }: SourceCardProps) {
  if (!source) {
    return null
  }

  // Format date if available
  const formattedDate = source.publishedDate
    ? new Date(source.publishedDate).toLocaleDateString()
    : null

  return (
    <div
      className={cn(
        'flex flex-col bg-gray-50 dark:bg-gray-950 border-2 border-gray-300 dark:border-gray-700 rounded-none',
        className,
      )}
    >
      {/* Header - more brutalist with sharper edges and bolder borders */}
      <div className="px-4 py-3 border-b-2 border-gray-300 dark:border-gray-700 flex justify-between items-center bg-gray-100 dark:bg-gray-900">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 uppercase tracking-tight">
            {source.title || 'Source'}
          </h2>
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400">
            {source.sourceCategory?.name && (
              <span className="inline-flex items-center bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-300 px-2 py-0.5 rounded-none text-xs uppercase font-bold">
                {source.sourceCategory.name}
              </span>
            )}
            {source.author && (
              <span className="inline-flex items-center">
                <User className="mr-1 h-3 w-3" />
                {source.author}
              </span>
            )}
            {formattedDate && (
              <span className="inline-flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                {formattedDate}
              </span>
            )}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
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

      {/* Content - brutalist with less padding, boxier elements */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50 dark:bg-gray-950">
        {/* URL */}
        {source.url && (
          <div className="space-y-1">
            <div className="flex items-center">
              <ExternalLink className="h-4 w-4 text-gray-600 mr-2" />
              <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Source URL
              </h3>
            </div>
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline hover:bg-blue-50 dark:hover:bg-blue-900/20 px-1 break-all text-sm"
            >
              {source.url}
            </a>
          </div>
        )}

        {/* One Sentence Summary */}
        {source.oneSentenceSummary && (
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Summary
            </h3>
            <div className="p-2 bg-white dark:bg-gray-900 border-l-4 border-blue-400 dark:border-blue-500 text-gray-800 dark:text-gray-200 text-sm">
              {source.oneSentenceSummary}
            </div>
          </div>
        )}

        {/* Main Points */}
        {source.mainPoints && source.mainPoints.length > 0 && (
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Main Points
            </h3>
            <div className="space-y-2">
              {source.mainPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-white dark:bg-gray-900 border-l-4 border-gray-400 dark:border-gray-500 text-gray-800 dark:text-gray-200 text-sm"
                >
                  {point.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bullet Summary */}
        {source.bulletSummary && source.bulletSummary.length > 0 && (
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Key Points
            </h3>
            <div className="p-2 bg-white dark:bg-gray-900 border-l-4 border-gray-400 dark:border-gray-500 text-gray-800 dark:text-gray-200">
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {source.bulletSummary.map((point, idx) => (
                  <li key={idx}>{point.text}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* People, Places, Things, Events */}
        {source.peopleplacesthingsevents && source.peopleplacesthingsevents.length > 0 && (
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              People, Places, Things, Events
            </h3>
            <div className="space-y-2">
              {source.peopleplacesthingsevents.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-white dark:bg-gray-900 border-l-4 border-orange-400 dark:border-orange-500 text-gray-800 dark:text-gray-200 text-sm"
                >
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quotations */}
        {source.quotations && source.quotations.length > 0 && (
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Quotations
            </h3>
            <div className="space-y-2">
              {source.quotations.map((quote, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-white dark:bg-gray-900 border-l-4 border-purple-400 dark:border-purple-500 text-gray-800 dark:text-gray-200 italic text-sm"
                >
                  {quote.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Details */}
        {source.details && source.details.length > 0 && (
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Details
            </h3>
            <div className="space-y-2">
              {source.details.map((detail, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-white dark:bg-gray-900 border-l-4 border-teal-400 dark:border-teal-500 text-gray-800 dark:text-gray-200 text-sm"
                >
                  {detail.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {source.tags && source.tags.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center">
              <Tag className="h-4 w-4 text-gray-600 mr-2" />
              <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Tags
              </h3>
            </div>
            <div className="flex flex-wrap gap-1">
              {source.tags.map(
                (tag, idx) =>
                  tag.tag && (
                    <span
                      key={idx}
                      className="inline-flex items-center bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-0.5 text-xs font-mono"
                    >
                      {tag.tag}
                    </span>
                  ),
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer - blockier with bold font */}
      <div className="px-4 py-2 border-t-2 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-xs text-gray-600 dark:text-gray-400 font-mono">
        <div>ID: {source.id}</div>
      </div>
    </div>
  )
}
