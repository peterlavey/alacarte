import React from 'react'
import Scanner from '@/components/Scanner/Scanner'
import styles from '../Home.module.css'

interface ScannerSectionProps {
  onScan: (result: unknown) => void
  onError: (err: Error) => void
  onCancel: () => void
  title?: string
}

export default function ScannerSection({ onScan, onError, onCancel, title = 'Scan QR' }: ScannerSectionProps) {
  return (
    <div className={styles.scannerSection}>
      <h1 className={styles.title}>{title}</h1>
      <p style={{ color: 'var(--muted-text)', marginBottom: '2rem' }}>
        Point your camera at the restaurant's QR code.
      </p>
      <div style={{ borderRadius: '8px', overflow: 'hidden', marginBottom: '2rem' }}>
        <Scanner 
          active={true} 
          onDecode={onScan} 
          onError={onError} 
        />
      </div>
      <button onClick={onCancel} className={styles.secondaryButton}>
        Go Back
      </button>
    </div>
  )
}
