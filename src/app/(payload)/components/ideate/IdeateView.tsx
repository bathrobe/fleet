'use client'

import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/app/ui/card'
import { Button } from '@/app/ui/button'
import { Sparkles } from 'lucide-react'

const IdeateView = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Ideate</h1>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Ideate with ShadCN</CardTitle>
          <CardDescription>
            This is a demo of the Ideate view using ShadCN UI components in the Payload admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Welcome to the Ideate tool! This interface will help you explore your knowledge base and
            generate new ideas using different ideation methods.
          </p>
          <p className="text-sm text-muted-foreground">
            Select a method from below to get started.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>
            <Sparkles className="h-4 w-4" />
            Generate Ideas
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default IdeateView
