import React from 'react'
import '@/styles/globals.css'
import Link from 'next/link'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <header className="w-full py-4 px-6 border-b border-gray-200 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div className="font-bold text-2xl">Concept Vector Explorer</div>
          <nav className="flex space-x-6">
            <Link href="/" className="font-medium hover:text-primary">
              Home
            </Link>
            <Link href="/ideate" className="font-medium hover:text-primary">
              Ideate
            </Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
