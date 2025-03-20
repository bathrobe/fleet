'use client'

import { useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'

type Category = {
  id: string
  title: string
}

type CategoryDropdownProps = {
  selectedCategory: string
  onCategoryChange: (categoryId: string) => void
  required?: boolean
}

export const CategoryDropdown = ({
  selectedCategory,
  onCategoryChange,
  required = true,
}: CategoryDropdownProps) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { pending } = useFormStatus()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/source-categories?limit=100')
        const data = await response.json()

        if (data.docs && Array.isArray(data.docs)) {
          setCategories(data.docs)
          // Log categories for debugging
          console.log('Fetched categories:', data.docs)
        } else {
          throw new Error('Invalid response format')
        }
      } catch (err) {
        setError('Failed to load categories')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    console.log('Selected category ID:', value) // Debug log
    onCategoryChange(value)
  }

  if (isLoading) return <div className="text-slate-300 text-sm">Loading categories...</div>
  if (error) return <div className="text-red-500 text-sm">{error}</div>

  return (
    <div className="mb-6 pb-6 border-b border-slate-700">
      <label htmlFor="category" className="block mb-2 text-slate-300 text-sm font-medium">
        Source Category {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name="sourceCategory"
        id="category"
        value={selectedCategory}
        onChange={handleChange}
        className="w-full p-2 border border-slate-700 rounded bg-slate-800 text-slate-100 text-sm"
        disabled={pending}
        required={required}
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.title}
          </option>
        ))}
      </select>
    </div>
  )
}
