import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { register } from '@/api'
import styles from './WhatsAppLinkRequest.module.css'

export default function WhatsAppLinkRequest() {
  const [realUrl, setRealUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const location = useLocation()
  const navigate = useNavigate()
  const { lat, lon } = (location.state as { lat?: number; lon?: number }) || {}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!realUrl) return
    if (lat === undefined || lon === undefined) {
      setError('Location context missing. Please try scanning again.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 1. Validate the real URL (current requirement)
      if (realUrl.startsWith('http')) {
        try {
          await axios.get(realUrl, { 
            timeout: 5000,
            headers: { 'Range': 'bytes=0-0' }
          })
        } catch (err) {
          console.error('Real URL validation failed:', err)
          setError('The link you provided is not accessible. Please check it and try again.')
          setLoading(false)
          return
        }
      } else {
        setError('Please provide a valid URL starting with http or https.')
        setLoading(false)
        return
      }

      // 2. Register the real URL
      await register({
        lat,
        lon,
        content: realUrl,
      })

      // 3. Success -> Redirect
      window.location.href = realUrl
    } catch (err) {
      console.error('Registration failed:', err)
      setError('Failed to save the link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (lat === undefined || lon === undefined) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Missing Information</h1>
        <p>Could not find location coordinates. Please go back and scan the QR code again.</p>
        <button onClick={() => navigate('/')} className={styles.button}>Go Back</button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>WhatsApp Link Detected</h1>
      <p className={styles.description}>
        Please paste the real link you received in your WhatsApp message to continue.
      </p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="url"
          value={realUrl}
          onChange={(e) => setRealUrl(e.target.value)}
          placeholder="https://example.com/your-real-link"
          required
          className={styles.input}
          disabled={loading}
        />
        
        {error && <p className={styles.error}>{error}</p>}
        
        <button type="submit" className={styles.button} disabled={loading || !realUrl}>
          {loading ? 'Validating...' : 'Continue'}
        </button>
        
        <button 
          type="button" 
          onClick={() => navigate('/')} 
          className={styles.secondaryButton}
          disabled={loading}
        >
          Cancel
        </button>
      </form>
    </div>
  )
}
