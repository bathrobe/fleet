'use client'

import { ReactNode, useEffect, useState } from 'react'

type FullWidthLayoutProps = {
  leftSidebar: ReactNode
  mainContent: ReactNode
  rightPanel?: ReactNode
}

export const FullWidthLayout = ({ leftSidebar, mainContent, rightPanel }: FullWidthLayoutProps) => {
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
        {/* Main content takes full screen on mobile */}
        <div className="flex-1 w-full overflow-hidden">{mainContent}</div>

        {/* We don't show the rightPanel separately on mobile since 
            it's integrated into the ConceptVectorSpace component */}
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
