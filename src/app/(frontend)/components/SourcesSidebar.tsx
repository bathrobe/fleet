'use client'

import Link from 'next/link'
import { Source } from '@/payload-types'

interface SourcesSidebarProps {
  sources: Source[]
}

export const SourcesSidebar = ({ sources }: SourcesSidebarProps) => {
  return (
    <aside className="sources-sidebar">
      <h2>Sources</h2>
      <div className="sources-list">
        {sources.map((source) => (
          <Link key={source.id} href={`/sources/${source.id}`} className="source-item">
            <h3>{source.title}</h3>
            <p>{source.oneSentenceSummary}</p>
            {source.tags && source.tags.length > 0 && (
              <div className="tags">
                {source.tags.map((tag, i) => (
                  <span key={i} className="tag">
                    {tag.tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
      <style jsx>{`
        .sources-sidebar {
          width: 300px;
          height: 100vh;
          background: #1a2233;
          padding: 1.5rem;
          border-right: 1px solid #2a3a5a;
          overflow-y: auto;
        }

        h2 {
          color: #e1e8f5;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #2a3a5a;
        }

        .sources-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .source-item {
          padding: 1rem;
          background: #2a3a5a;
          border-radius: 8px;
          border: 1px solid #3d4e6e;
          transition: all 0.2s ease;
          text-decoration: none;
          color: inherit;
        }

        .source-item:hover {
          background: #3a4a6a;
          transform: translateY(-2px);
        }

        .source-item h3 {
          color: #c5e1ff;
          font-size: 1rem;
          margin: 0 0 0.5rem 0;
        }

        .source-item p {
          color: #a9c5f5;
          font-size: 0.9rem;
          margin: 0 0 0.75rem 0;
          line-height: 1.4;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          background: #1a2233;
          color: #8bb8ff;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }
      `}</style>
    </aside>
  )
}
