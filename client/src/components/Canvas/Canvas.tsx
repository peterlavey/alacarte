import React from 'react'
import styles from './Canvas.module.css'

interface CanvasProps {
  content: unknown
}

export default function Canvas({ content }: CanvasProps) {
  if (content == null) {
    return <div className={styles.empty}>No content</div>
  }

  const isObject = typeof content === 'object'
  const display = isObject ? JSON.stringify(content, null, 2) : String(content)

  return <pre className={styles.pre}>{display}</pre>
}
