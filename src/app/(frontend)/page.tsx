export default function HomePage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Hello World</h1>
        <p className="text-xl">Welcome to the Concept Vector Explorer</p>
        <a
          href="/graph"
          className="inline-block mt-6 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          View Concept Graph
        </a>
      </div>
    </div>
  )
}
