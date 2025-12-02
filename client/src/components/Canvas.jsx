import React from 'react'

export default function Canvas({ content }) {
  if (content == null) {
    return <div style={{ padding: 12, color: '#666' }}>No content</div>
  }

  const isObject = typeof content === 'object'
  const display = isObject ? JSON.stringify(content, null, 2) : String(content)

  return (
    <pre style={{
      padding: 12,
      background: '#0b1020',
      color: '#cce6ff',
      borderRadius: 8,
      minHeight: 160,
      overflow: 'auto',
      margin: 0,
    }}>{display}</pre>
  )
}
