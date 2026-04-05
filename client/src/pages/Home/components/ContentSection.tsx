import React from 'react'
import Canvas from '@/components/Canvas/Canvas'
import styles from '../Home.module.css'

interface Candidate {
  name: string
  content: string
  photo_url?: string
  place_id?: string
}

interface ContentSectionProps {
  content: unknown
  candidates: Candidate[]
  showConfirmation: boolean
  onConfirm: (index: number) => void
  onReject: () => void
  onScanAnother: () => void
}

export default function ContentSection({ 
  content, 
  candidates, 
  showConfirmation, 
  onConfirm, 
  onReject, 
  onScanAnother 
}: ContentSectionProps) {
  if (showConfirmation && candidates.length > 0) {
    const primary = candidates[0]
    return (
      <div className={styles.contentSection}>
        <h1 className={styles.title}>Are you here?</h1>
        <div className={styles.candidateCard}>
          {primary.photo_url && (
            <img 
              src={primary.photo_url} 
              alt={primary.name} 
              className={styles.candidateLogo}
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          )}
          <h2 className={styles.candidateName}>{primary.name}</h2>
        </div>
        <div className={styles.buttonGroup}>
          <button onClick={() => onConfirm(0)} className={styles.button}>
            Yes, it's correct
          </button>
          <button onClick={onReject} className={styles.secondaryButton}>
            No, show more
          </button>
        </div>
      </div>
    )
  }

  if (!content && candidates.length > 1) {
    return (
      <div className={styles.contentSection}>
        <h1 className={styles.title}>Select Restaurant</h1>
        <p style={{ color: 'var(--muted-text)', marginBottom: '1.5rem' }}>
          We found several places nearby. Which one is correct?
        </p>
        <div className={styles.candidateList}>
          {candidates.slice(1, 6).map((candidate, index) => (
            <button 
              key={candidate.place_id || index} 
              onClick={() => onConfirm(index + 1)}
              className={styles.candidateListItem}
            >
              {candidate.name}
            </button>
          ))}
        </div>
        <button onClick={onScanAnother} className={styles.secondaryButton} style={{ marginTop: '2rem' }}>
          None of these, try again
        </button>
      </div>
    )
  }

  return (
    <div className={styles.contentSection}>
      <h1 className={styles.title}>Welcome</h1>
      <p style={{ color: 'var(--muted-text)', marginBottom: '2rem' }}>
        We've located your menu.
      </p>
      <div style={{ marginBottom: '2.5rem' }}>
        <Canvas content={content} />
      </div>
      <button onClick={onScanAnother} className={styles.secondaryButton}>
        Try Again
      </button>
    </div>
  )
}
