'use client'

export const LLMSourceNoteDisplay = ({ result }: { result: any }) => {
  console.log('LLM display received result:', result)

  // Safely check if result exists and has expected properties
  if (!result) return null

  // Add these checks to prevent the "map of undefined" error
  const hasSummary = result.summary !== undefined
  const hasTags = Array.isArray(result.tags)
  const hasInsights = Array.isArray(result.insights)

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
      <h3>LLM Analysis Result</h3>

      {hasSummary && (
        <div>
          <h4 style={{ color: '#0c65d1' }}>Summary</h4>
          <p>{result.summary}</p>
        </div>
      )}

      {hasTags && (
        <div>
          <h4 style={{ color: '#0c9d1e' }}>Tags</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {result.tags.map((tag: any, index: number) => (
              <span
                key={index}
                style={{
                  background: '#e0e7ff',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {hasInsights && (
        <div>
          <h4 style={{ color: '#d16e0c' }}>Key Insights</h4>
          <ul>
            {result.insights.map((insight: any, index: number) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
