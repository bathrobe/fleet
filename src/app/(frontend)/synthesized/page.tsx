'use client'

import { SidebarInset, SidebarTrigger } from '../ui/sidebar'

export default function SynthesizedAtomsPage() {
  return (
    <SidebarInset>
      <header className="flex h-14 items-center border-b px-4">
        <SidebarTrigger className="mr-4" />
        <h1 className="text-lg font-semibold">Synthesized Atoms</h1>
      </header>

      <div className="flex h-full items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold">Select a Synthesized Atom</h2>
          <p className="mt-2 text-muted-foreground">
            Select a synthesized atom from the sidebar to view its details. Synthesized atoms are
            created by combining multiple atoms.
          </p>
        </div>
      </div>
    </SidebarInset>
  )
}
