import React from 'react'
import Canvas from '@/components/Canvas/Canvas'
import styles from '../Home.module.css'

interface ContentSectionProps {
  content: unknown
  onScanAnother: () => void
}

export default function ContentSection({ content, onScanAnother }: ContentSectionProps) {
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
        Scan different QR
      </button>
    </div>
  )
}
