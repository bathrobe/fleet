'use client'

export const LLMResponseDisplay = ({ result }: { result: any }) => {
  if (!result) return null
  // Convert result to string if it's not already a string
  const resultString = typeof result === 'string' ? result : JSON.stringify(result, null, 2)

  return (
    <div className="p-4 bg-slate-900 border border-slate-700 rounded my-4 text-slate-100">
      <div className="whitespace-pre-wrap">{resultString}</div>
    </div>
  )
}
