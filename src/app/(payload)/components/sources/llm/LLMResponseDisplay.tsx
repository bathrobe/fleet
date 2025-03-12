'use client'

export const LLMResponseDisplay = ({ result }: { result: string }) => {
  if (!result) return null

  return (
    <div
      style={{
        padding: '15px',
        background: '#f5f9ff',
        border: '1px solid #d0e0ff',
        borderRadius: '4px',
        marginBottom: '1rem',
        marginTop: '1rem',
      }}
    >
      <h3>AI Analysis</h3>
      <div style={{ whiteSpace: 'pre-wrap' }}>{result}</div>
    </div>
  )
}
