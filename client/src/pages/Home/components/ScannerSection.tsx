import React from 'react'
import Scanner from '@/components/Scanner/Scanner'
import styles from '../Home.module.css'

interface ScannerSectionProps {
  onScan: (result: unknown) => void
  onError: (err: Error) => void
  onCancel: () => void
}

export default function ScannerSection({ onScan, onError, onCancel }: ScannerSectionProps) {
  return (
    <div className={styles.scannerSection}>
      <h1 className={styles.title}>Scan QR code</h1>
      <p>Scan a QR code to register this location</p>
      <Scanner 
        active={true} 
        onDecode={onScan} 
        onError={onError} 
      />
      <button onClick={onCancel} className={styles.secondaryButton}>
        Cancel
      </button>
    </div>
  )
}
