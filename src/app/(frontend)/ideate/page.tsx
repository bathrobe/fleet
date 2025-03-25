import { IdeasWorkspace } from '@/app/(frontend)/ideate/components/IdeasWorkspace'

export default function IdeatePage() {
  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Ideate</h1>

      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-400">
          Use different ideation methods to explore your knowledge base and generate new ideas.
          Select a method from the dropdown and begin exploring.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-800">
        <IdeasWorkspace />
      </div>
    </div>
  )
}
