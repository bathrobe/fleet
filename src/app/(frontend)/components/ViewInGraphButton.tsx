'use client'

import { Link2 } from 'lucide-react'
import { Button } from '@/app/ui/button'
import { toast } from 'sonner'

type ViewInGraphButtonProps = {
  atomId: string | number
  pineconeId: string
  collection?: string
  className?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

/**
 * Button to copy a direct link to view an atom in the concept graph
 *
 * Example usage:
 * <ViewInGraphButton
 *   atomId={atom.id}
 *   pineconeId={atom.pineconeId}
 *   collection={atom.isSynthesized ? 'synthesizedAtoms' : 'atoms'}
 * />
 */
export function ViewInGraphButton({
  atomId,
  pineconeId,
  collection = 'atoms',
  className,
  variant = 'outline',
  size = 'sm',
}: ViewInGraphButtonProps) {
  if (!pineconeId) {
    return null
  }

  // Generate the URL that can be used to link directly to this atom
  const type = collection === 'synthesizedAtoms' ? 's' : undefined
  const atomUrl = type ? `/?v=${pineconeId}&a=${atomId}&t=s` : `/?v=${pineconeId}&a=${atomId}`

  const handleLinkShare = () => {
    // Create the full URL including the origin
    const fullUrl = `${window.location.origin}${atomUrl}`
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        toast.success('Link copied to clipboard')
      })
      .catch((err) => {
        console.error('Failed to copy link: ', err)
        toast.error('Failed to copy link')
      })
  }

  return (
    <Button variant={variant} size={size} className="gap-1" onClick={handleLinkShare}>
      <Link2 className="h-4 w-4" />
      <span>Copy Link</span>
    </Button>
  )
}
