import React, { useState } from 'react'
import styles from './JsonInput.module.css'

interface JsonInputProps {
  onSubmit: (data: any, lat: number, lon: number) => void
  disabled?: boolean
  initialLat?: number
  initialLon?: number
}

export default function JsonInput({ onSubmit, disabled, initialLat, initialLon }: JsonInputProps) {
  const [text, setText] = useState('')
  const [lat, setLat] = useState(initialLat?.toString() || '')
  const [lon, setLon] = useState(initialLon?.toString() || '')
  const [error, setError] = useState('')

  // Update lat/lon when initial values change (e.g. location resolved)
  React.useEffect(() => {
    if (initialLat !== undefined) setLat(initialLat.toString())
  }, [initialLat])

  React.useEffect(() => {
    if (initialLon !== undefined) setLon(initialLon.toString())
  }, [initialLon])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      let content = text
      try {
        content = JSON.parse(text)
      } catch {
        // Not valid JSON, treat as plain text
      }
      const latNum = parseFloat(lat)
      const lonNum = parseFloat(lon)

      if (isNaN(latNum) || isNaN(lonNum)) {
        setError('Lat and Lon must be valid numbers')
        return
      }

      onSubmit && onSubmit(content, latNum, lonNum)
    } catch (err) {
      setError('Unexpected error submitting content')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.row}>
        <label className={styles.label}>
          Latitude
          <input
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            disabled={disabled}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Longitude
          <input
            type="number"
            step="any"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            disabled={disabled}
            className={styles.input}
          />
        </label>
      </div>
      <label className={styles.label}>
        JSON content
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder='{"hello":"world"}'
          disabled={disabled}
          className={styles.textarea}
        />
      </label>
      {error && <div className={styles.error}>{error}</div>}
      <button type="submit" disabled={disabled}>Submit</button>
    </form>
  )
}
