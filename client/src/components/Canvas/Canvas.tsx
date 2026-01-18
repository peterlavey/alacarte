import React from 'react'
import styles from './Canvas.module.css'

interface CanvasProps {
  content: unknown
}

export default function Canvas({ content }: CanvasProps) {
  if (content == null) {
    return <div className={styles.empty}>No content</div>
  }

  const contentStr = String(content)
  const isUrl = contentStr.startsWith('http')

  if (isUrl) {
    return (
      <div className={styles.urlContent}>
        <span className={styles.urlText}>{contentStr}</span>
        <a 
          href={contentStr} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn"
          style={{ textDecoration: 'none', display: 'inline-block' }}
        >
          Open Menu
        </a>
      </div>
    )
  }

  const isObject = typeof content === 'object'
  const display = isObject ? JSON.stringify(content, null, 2) : contentStr

  return <pre className={styles.pre}>{display}</pre>
}
