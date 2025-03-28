'use client'

import Link from 'next/link'

type AtomLinkProps = {
  atomId: string | number
  pineconeId: string
  collection?: string
  children: React.ReactNode
  className?: string
}

/**
 * AtomLink component for linking to the concept graph with a specific atom highlighted.
 *
 * Example usage:
 * <AtomLink atomId={atom.id} pineconeId={atom.pineconeId} collection="atoms">
 *   View in concept graph
 * </AtomLink>
 */
export function AtomLink({
  atomId,
  pineconeId,
  collection = 'atoms',
  children,
  className,
}: AtomLinkProps) {
  // Use shorter parameter names: v=vector id, a=atom id, t=type (s=synthesized or omitted for regular atoms)
  const type = collection === 'synthesizedAtoms' ? 's' : undefined
  const href = type ? `/?v=${pineconeId}&a=${atomId}&t=s` : `/?v=${pineconeId}&a=${atomId}`

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}
