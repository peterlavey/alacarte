import React from 'react'
import { Scanner as QrScanner } from '@yudiel/react-qr-scanner'

export default function Scanner({ active, onDecode, onError, onClose }) {
  if (!active) return null
  return (
    <div style={{ position: 'relative', border: '1px solid #ccc', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>
        {onClose && (
          <button type="button" onClick={onClose}>Close</button>
        )}
      </div>
      <QrScanner
        onScan={(result) => onDecode && onDecode(result)}
        onError={(err) => onError && onError(err)}
        constraints={{ facingMode: 'environment' }}
        style={{ width: '100%' }}
      />
    </div>
  )
}
