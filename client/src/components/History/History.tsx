import React from 'react'
import styles from './History.module.css'

export interface HistoryRecord {
  createdAt: string | number | Date
  lat: number
  lon: number
  content: unknown
}

export interface HistoryProps {
  records?: HistoryRecord[]
  onSelect?: (record: HistoryRecord) => void
}

export default function History({ records = [], onSelect }: HistoryProps) {
  if (!records.length) {
    return <div className={styles.empty}>No history yet</div>
  }
  return (
    <ul className={styles.list}>
      {records.map((r, idx) => (
        <li key={`${String(r.createdAt)}-${idx}`} className={styles.item}>
          <button type="button" onClick={() => onSelect && onSelect(r)} className={styles.entryButton}>
            <div className={styles.createdAt}>{new Date(r.createdAt).toLocaleString()}</div>
            <div className={styles.coords}>
              @ {r.lat.toFixed(5)}, {r.lon.toFixed(5)}
            </div>
            <div className={styles.contentPreview}>
              {typeof r.content === 'object' ? JSON.stringify(r.content as any) : String(r.content)}
            </div>
          </button>
        </li>
      ))}
    </ul>
  )
}
