import React, { useState } from 'react'

export default function JsonInput({ onSubmit, disabled }) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
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
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label>
        JSON content
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder='{"hello":"world"}'
          disabled={disabled}
          style={{ width: '100%' }}
        />
      </label>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type='submit' disabled={disabled}>Submit</button>
    </form>
  )
}
