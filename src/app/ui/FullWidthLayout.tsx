'use client'

import { ReactNode, useEffect, useState } from 'react'

type FullWidthLayoutProps = {
  leftSidebar: ReactNode
  mainContent: ReactNode
  rightPanel?: ReactNode
  mobileBottomPanel?: ReactNode
}

export const FullWidthLayout = ({
  leftSidebar,
  mainContent,
  rightPanel,
  mobileBottomPanel,
}: FullWidthLayoutProps) => {
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile viewport
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)

    return () => {
      window.removeEventListener('resize', checkIsMobile)
    }
  }, [])

  // For mobile layout
  if (isMobile) {
    return (
      <div className="h-screen w-full flex flex-col">
        {/* Split the screen - graph on top half, atom card on bottom half if present */}
        {mobileBottomPanel ? (
          <>
            {/* Graph takes top half of the screen */}
            <div className="w-full" style={{ height: '50vh' }}>
              {mainContent}
            </div>

            {/* AtomCard takes bottom half */}
            <div
              className="w-full overflow-y-auto border-t border-gray-200 dark:border-gray-800"
              style={{ height: '50vh' }}
            >
              {mobileBottomPanel}
            </div>
          </>
        ) : (
          // If no atom is selected, graph takes full screen
          <div className="flex-1 w-full overflow-hidden">{mainContent}</div>
        )}
      </div>
    )
  }

  // Desktop layout
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
