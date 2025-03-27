'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileUp, Sparkles } from 'lucide-react'

// These are the custom links we want to add to the Payload admin nav
const customLinks = [
  {
    label: 'Source Uploader',
    path: '/admin/source-uploader',
    icon: <FileUp className="h-4 w-4 mr-1" />,
  },
  {
    label: 'Ideate',
    path: '/admin/ideate',
    icon: <Sparkles className="h-4 w-4 mr-1" />,
  },
]

export const AdminNavLinks: React.FC = () => {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-2">
      {customLinks.map((link) => (
        <Link
          key={link.path}
          href={link.path}
          className={`
            flex items-center text-sm px-3 py-1 rounded 
            ${
              pathname === link.path
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }
          `}
        >
          {link.icon}
          {link.label}
        </Link>
      ))}
    </div>
  )
}
