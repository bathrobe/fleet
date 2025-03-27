export const maxDuration = 300 // 5 minutes

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/card'
import { Button } from '@/app/ui/button'
import { ArrowLeft, Home } from 'lucide-react'

interface SourcePageLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  title: string
}

export function SourcePageLayout({ children, sidebar, title }: SourcePageLayoutProps) {
  return (
    <div className="max-w-[1200px] mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <Link href="/admin">
          <Button
            variant="default"
            size="lg"
            className="gap-2 px-6 font-medium shadow-sm hover:shadow"
          >
            <Home className="h-5 w-5" />
            Back to Admin Dashboard
          </Button>
        </Link>
      </div>

      <div className={`flex gap-6 ${sidebar ? 'flex-col lg:flex-row' : 'flex-col'}`}>
        {/* Main content area */}
        <div className="flex-1 min-w-0">
          <Card className="border-0 shadow-sm bg-background">
            <CardContent className="p-6 pt-6">{children}</CardContent>
          </Card>
        </div>

        {/* Right sidebar, only rendered if provided */}
        {sidebar && <div className="w-full lg:w-[350px] flex-none">{sidebar}</div>}
      </div>
    </div>
  )
}
