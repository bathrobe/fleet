'use client'

import { ReactNode } from 'react'

type FullWidthLayoutProps = {
  leftSidebar: ReactNode
  mainContent: ReactNode
  rightPanel?: ReactNode
}

export const FullWidthLayout = ({ leftSidebar, mainContent, rightPanel }: FullWidthLayoutProps) => {
  return (
    <div
      className="grid h-screen w-full"
      style={{
        gridTemplateColumns: rightPanel ? 'auto 1fr 65ch' : 'auto 1fr',
        gridTemplateRows: '100%',
        minHeight: '100vh',
      }}
    >
      <div className="h-full overflow-y-auto">{leftSidebar}</div>
      <div className="h-full w-full overflow-hidden">{mainContent}</div>
      {rightPanel && (
        <div className="h-full border-l border-gray-200 dark:border-gray-800">{rightPanel}</div>
      )}
    </div>
  )
}
