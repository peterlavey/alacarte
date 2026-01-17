import React from 'react'
import { Scanner as QrScanner } from '@yudiel/react-qr-scanner'
import styles from './Scanner.module.css'

interface ScannerProps {
  active: boolean
  onDecode?: (result: unknown) => void
  onError?: (err: Error) => void
  onClose?: () => void
}

export default function Scanner({ active, onDecode, onError, onClose }: ScannerProps) {
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
