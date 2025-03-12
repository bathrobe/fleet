'use client'

export const LLMSourceNoteDisplay = ({ result }: { result: any }) => {
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
      <h3>LLM Analysis Result</h3>

      <div>
        <h4>Summary</h4>
        <p>{result.summary}</p>
      </div>

      <div>
        <h4>Tags</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {result.tags.map((tag: string, index: number) => (
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

      <div>
        <h4>Key Insights</h4>
        <ul>
          {result.insights.map((insight: string, index: number) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
