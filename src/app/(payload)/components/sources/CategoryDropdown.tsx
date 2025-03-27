'use client'

import { useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/ui/select'
import { Label } from '@/app/ui/label'

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

  const handleChange = (value: string) => {
    console.log('Selected category ID:', value) // Debug log
    onCategoryChange(value)
  }

  if (isLoading) return <div className="text-muted-foreground text-sm">Loading categories...</div>
  if (error) return <div className="text-destructive text-sm">{error}</div>

  return (
    <div className="mb-6 pb-6 border-b">
      <div className="mb-2">
        <Label htmlFor="category" className="text-sm font-medium">
          Source Category {required && <span className="text-destructive">*</span>}
        </Label>
      </div>

      <Select value={selectedCategory} onValueChange={handleChange} disabled={pending}>
        <SelectTrigger id="category" className="w-full" data-required={required}>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
