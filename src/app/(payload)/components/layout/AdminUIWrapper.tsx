// src/app/(payload)/components/AdminUIWrapper.tsx
'use client'

import React from 'react'
import { cn } from '@/app/(frontend)/lib/utils'

export function AdminUIWrapper({ children }: { children: React.ReactNode }) {
  return <div className={cn('min-h-screen bg-background text-foreground')}>{children}</div>
}
