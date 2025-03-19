'use client'

import Link from 'next/link'
import { Source } from '@/payload-types'

interface SourcesSidebarProps {
  sources: Source[]
}

export const SourcesSidebar = ({ sources }: SourcesSidebarProps) => {
  return (
    <aside className="w-[300px] h-screen bg-slate-900 p-6 border-r border-slate-700 overflow-y-auto">
      <h2 className="text-xl text-slate-100 mb-6 pb-2 border-b border-slate-700">Sources</h2>
      <div className="flex flex-col gap-4">
        {sources.map((source) => (
          <Link
            key={source.id}
            href={`/sources/${source.id}`}
            className="p-4 bg-slate-800 rounded-lg border border-slate-700 transition-all duration-200 hover:bg-slate-700 hover:-translate-y-0.5 text-slate-100 no-underline"
          >
            <h3 className="text-blue-200 text-base mb-2">{source.title}</h3>
            <p className="text-slate-300 text-sm mb-3 leading-relaxed">
              {source.oneSentenceSummary}
            </p>
            {source.tags && source.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {source.tags.map((tag, i) => (
                  <span key={i} className="bg-slate-900 text-blue-300 px-2 py-1 rounded text-xs">
                    {tag.tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </aside>
  )
}
