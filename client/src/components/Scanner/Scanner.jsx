import React from 'react'
import { Scanner as QrScanner } from '@yudiel/react-qr-scanner'
import styles from './Scanner.module.css'

export default function Scanner({ active, onDecode, onError, onClose }) {
  if (!active) return null
  return (
    <div className={styles.container}>
      <div className={styles.closeWrap}>
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
