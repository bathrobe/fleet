'use client'

export const LLMResponseDisplay = ({ result }: { result: any }) => {
  if (!result) return null
  // Convert result to string if it's not already a string
  const resultString = typeof result === 'string' ? result : JSON.stringify(result, null, 2)

  return (
    <div
      style={{
        padding: '15px',
        background: '#1a2233',
        border: '1px solid #2a3a5a',
        borderRadius: '4px',
        marginBottom: '1rem',
        marginTop: '1rem',
        color: '#e1e8f5',
      }}
    >
      <div style={{ whiteSpace: 'pre-wrap' }}>{resultString}</div>
    </div>
  )
}
