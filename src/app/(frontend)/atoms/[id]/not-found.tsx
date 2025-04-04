import Link from 'next/link'

export default function AtomNotFound() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Atom Not Found</h2>
        <p className="mb-6 text-muted-foreground">
          The atom you are looking for could not be found or has been removed.
        </p>
        <Link
          href="/atoms"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Back to Atoms
        </Link>
      </div>
    </div>
  )
}
