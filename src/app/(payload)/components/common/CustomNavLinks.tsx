'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileUp, Sparkles } from 'lucide-react'

const CustomNavLinks: React.FC = () => {
  const pathname = usePathname()

  // Only show on the main admin dashboard
  if (pathname !== '/admin') {
    return null
  }

  const navItems = [
    {
      label: 'Source Uploader',
      description: 'Upload and process markdown content with frontmatter',
      href: '/admin/source-uploader',
      icon: <FileUp className="h-6 w-6" />,
      color: 'bg-blue-500',
    },
    {
      label: 'Ideate',
      description: 'Generate new connections between existing concepts',
      href: '/admin/ideate',
      icon: <Sparkles className="h-6 w-6" />,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="mb-10 mt-2">
      <h2 className="text-lg font-medium mb-4 px-2">Quick Access</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="group block no-underline">
            <div
              className="border rounded-lg p-6 h-full transition-all duration-200 
                          hover:shadow-md hover:border-primary dark:border-gray-800 
                          dark:hover:border-primary dark:bg-gray-900"
            >
              <div className="flex items-start gap-4">
                <div className={`${item.color} text-white p-3 rounded-lg`}>{item.icon}</div>
                <div>
                  <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                    {item.label}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// This is important for Payload to properly use this component
CustomNavLinks.displayName = 'CustomNavLinks'

export default CustomNavLinks
