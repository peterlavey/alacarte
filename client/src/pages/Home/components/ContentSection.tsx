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
      <h1 className={styles.title}>Found Content</h1>
      <Canvas content={content} />
      <button onClick={onScanAnother} className={styles.button}>
        Scan Another
      </button>
    </div>
  )
}
