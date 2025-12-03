import React from 'react'

export default function History({ records = [], onSelect }) {
  if (!records.length) {
    return <div style={{ padding: 8, color: '#666' }}>No history yet</div>
  }
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {records.map((r, idx) => (
        <li key={`${r.createdAt}-${idx}`} style={{ borderBottom: '1px solid #eee' }}>
          <button
            type="button"
            onClick={() => onSelect && onSelect(r)}
            style={{
              width: '100%',
              textAlign: 'left',
              background: 'transparent',
              border: 'none',
              padding: '8px 6px',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 12, color: '#888' }}>{new Date(r.createdAt).toLocaleString()}</div>
            <div style={{ fontSize: 12 }}>@ {r.lat.toFixed(5)}, {r.lon.toFixed(5)}</div>
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {typeof r.content === 'object' ? JSON.stringify(r.content) : String(r.content)}
            </div>
          </button>
        </li>
      ))}
    </ul>
  )
}
