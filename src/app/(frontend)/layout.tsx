import React from 'react'
import '@/styles/globals.css'
import { Toaster } from '@/app/ui/sonner'

export const metadata = {
  description: 'Concept Vector Explorer',
  title: 'Concept Vector Explorer',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        <div className="flex flex-col h-screen">
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
