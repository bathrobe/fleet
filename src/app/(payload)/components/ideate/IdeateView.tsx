'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/app/ui/card'
import { Button } from '@/app/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { IdeasWorkspace } from './components'

const IdeateView = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Ideate</h1>
        <Link href="/admin">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Admin
          </Button>
        </Link>
      </div>

      <p className="text-muted-foreground mb-6">
        Use different ideation methods to explore your knowledge base and generate new ideas. Select
        a method from the dropdown and begin exploring.
      </p>

      <Card className="border-0 shadow-sm bg-background">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Ideation Workspace</CardTitle>
          <CardDescription>
            Generate new connections between existing concepts in your knowledge base.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IdeasWorkspace />
        </CardContent>
      </Card>
    </div>
  )
}

export default IdeateView
