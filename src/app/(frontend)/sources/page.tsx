'use client'

import { SidebarInset, SidebarTrigger } from '@/app/(frontend)/ui/sidebar'

export default function SourcesPage() {
  return (
    <SidebarInset>
      <header className="flex h-14 items-center border-b px-4">
        <SidebarTrigger className="mr-4" />
        <h1 className="text-lg font-semibold">Sources</h1>
      </header>

      <div className="flex h-full items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold">Select a Source</h2>
          <p className="mt-2 text-muted-foreground">
            Select a source from the sidebar to view its details. Sources are original materials
            that atoms are derived from.
          </p>
        </div>
      </div>
    </SidebarInset>
  )
}
