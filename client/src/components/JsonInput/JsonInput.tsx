import React, { useState } from 'react'
import styles from './JsonInput.module.css'

interface JsonInputProps {
  onSubmit: (data: any) => void
  disabled?: boolean
}

export default function JsonInput({ onSubmit, disabled }: JsonInputProps) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const parsed = JSON.parse(text)
      onSubmit && onSubmit(parsed)
      // keep text for convenience; clear if desired
    } catch (err) {
      setError('Invalid JSON')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label>
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
      <button type='submit' disabled={disabled}>Submit</button>
    </form>
  )
}
