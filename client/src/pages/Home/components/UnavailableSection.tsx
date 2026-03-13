import React from 'react'
import styles from '../Home.module.css'

interface UnavailableSectionProps {
  errorType: 'notFound' | 'redirectFailed' | null
  invalidUrl: string | null
  onRetryClick: () => void
}

export default function UnavailableSection({ errorType, invalidUrl, onRetryClick }: UnavailableSectionProps) {
  return (
    <div className={styles.unavailableSection}>
      <img 
        src="/images/not found.jpeg" 
        alt="Not found" 
        className={styles.notFoundImage} 
      />
      <h1 className={styles.title}>
        {errorType === 'redirectFailed' ? 'Menu Unavailable' : 'Discover Your Menu'}
      </h1>
      <p style={{ color: 'var(--muted-text)', marginBottom: '2rem' }}>
        {errorType === 'redirectFailed' 
          ? 'We found a link, but it seems unreachable at the moment.' 
          : "We couldn't locate a menu at this exact spot."}
      </p>
      
      {invalidUrl && (
        <div className={styles.invalidUrl}>
          <code>{invalidUrl}</code>
        </div>
      )}
      
      <div style={{ marginTop: '2rem' }}>
        <button onClick={onRetryClick} className={styles.button}>
          Retry
        </button>
      </div>
    </div>
  )
}
