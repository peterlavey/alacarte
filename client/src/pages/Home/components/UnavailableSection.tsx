import React from 'react'
import styles from '../Home.module.css'

interface UnavailableSectionProps {
  errorType: 'notFound' | 'redirectFailed' | null
  invalidUrl: string | null
  onScanClick: () => void
}

export default function UnavailableSection({ errorType, invalidUrl, onScanClick }: UnavailableSectionProps) {
  return (
    <div className={styles.unavailableSection}>
      <img 
        src="/images/not found.jpeg" 
        alt="Not found" 
        className={styles.notFoundImage} 
      />
      <h1 className={styles.title}>
        {errorType === 'redirectFailed' ? 'Redirect failed' : 'Menu not available'}
      </h1>
      <p>
        {errorType === 'redirectFailed' 
          ? 'We found a menu but could not open it. Please try scanning again.' 
          : "We couldn't find a menu for this location."}
      </p>
      {invalidUrl && (
        <p className={styles.invalidUrl}>
          URL: <code>{invalidUrl}</code>
        </p>
      )}
      <button onClick={onScanClick} className={styles.button}>
        Scan QR code
      </button>
    </div>
  )
}
