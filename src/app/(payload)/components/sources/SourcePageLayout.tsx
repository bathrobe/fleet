export const maxDuration = 300 // 5 minutes

import React from 'react'
import Link from 'next/link'

interface SourcePageLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  title: string
}

export function SourcePageLayout({ children, sidebar, title }: SourcePageLayoutProps) {
  return (
    <div className="max-w-[1200px] mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="m-0 text-slate-100">{title}</h1>
        <Link
          href="/admin"
          className="no-underline text-blue-200 font-bold px-4 py-2 bg-slate-800 rounded hover:bg-slate-700 transition-colors duration-200"
        >
          Back to Admin
        </Link>
      </div>

      <div className={`flex gap-8 ${sidebar ? 'flex-row' : 'flex-col'}`}>
        {/* Main content area */}
        <div className="flex-1 min-w-0">{children}</div>

        {/* Right sidebar, only rendered if provided */}
        {sidebar && <div className="w-[350px] flex-none">{sidebar}</div>}
      </div>
    </div>
  )
}
