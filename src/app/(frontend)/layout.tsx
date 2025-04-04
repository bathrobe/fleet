import React from 'react'
import '@/styles/globals.css'
import { Toaster } from '@/app/ui/sonner'
import { AppSidebar } from './components/app-sidebar'
import { SidebarProvider, SidebarInset } from './ui/sidebar'

export const metadata = {
  description: 'Concept Vector Explorer',
  title: 'Concept Vector Explorer',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <main className="h-full overflow-auto">{children}</main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  )
}
