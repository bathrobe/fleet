'use client'

import { useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'

type Medium = {
  id: string
  title: string
}

type MediumDropdownProps = {
  selectedMedium: string
  onMediumChange: (mediumId: string) => void
  required?: boolean
}

export const MediumDropdown = ({
  selectedMedium,
  onMediumChange,
  required = true,
}: MediumDropdownProps) => {
  const [media, setMedia] = useState<Medium[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { pending } = useFormStatus()

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/source-media?limit=100')
        const data = await response.json()

        if (data.docs && Array.isArray(data.docs)) {
          setMedia(data.docs)
          // Log media for debugging
          console.log('Fetched media:', data.docs)
        } else {
          throw new Error('Invalid response format')
        }
      } catch (err) {
        setError('Failed to load media')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMedia()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    console.log('Selected medium ID:', value) // Debug log
    onMediumChange(value)
  }

  if (isLoading) return <div className="text-slate-300 text-sm">Loading media...</div>
  if (error) return <div className="text-red-500 text-sm">{error}</div>

  return (
    <div className="mb-6 pb-6 border-b border-slate-700">
      <label htmlFor="medium" className="block mb-2 text-slate-300 text-sm font-medium">
        Source Medium {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name="sourceMedium"
        id="medium"
        value={selectedMedium}
        onChange={handleChange}
        className="w-full p-2 border border-slate-700 rounded bg-slate-800 text-slate-100 text-sm"
        disabled={pending}
        required={required}
      >
        <option value="">Select a medium</option>
        {media.map((medium) => (
          <option key={medium.id} value={medium.id}>
            {medium.title}
          </option>
        ))}
      </select>
    </div>
  )
}
