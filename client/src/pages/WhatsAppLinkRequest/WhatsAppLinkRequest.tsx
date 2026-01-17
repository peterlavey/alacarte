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
  const { lat, lon, whatsappUrl } = (location.state as { lat?: number; lon?: number; whatsappUrl?: string }) || {}

  const handleOpenWhatsApp = () => {
    if (whatsappUrl) {
      window.open(whatsappUrl, '_blank')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!realUrl) return
    if (lat === undefined || lon === undefined) {
      setError('Location context missing. Please try scanning again.')
      return
    }

    setLoading(true)
    setError(null)

    // Open window immediately to avoid popup blocker
    const win = window.open('about:blank', '_blank')

    try {
      // 1. Validate the real URL (current requirement)
      if (realUrl.startsWith('http')) {
        try {
          await axios.get(realUrl, { 
            timeout: 10000,
            headers: { 
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
              'Accept-Language': 'en-US,en;q=0.9',
            },
            validateStatus: (status) => (status >= 200 && status < 400) || status === 403
          })
        } catch (err) {
          console.error('Real URL validation failed:', err)
          if (win) win.close()
          setError('The link you provided is not accessible. Please check it and try again.')
          setLoading(false)
          return
        }
      } else {
        if (win) win.close()
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
      if (win) {
        win.location.href = realUrl
      } else {
        window.location.href = realUrl
      }
      // Note: we don't setLoading(false) here because we are redirecting
    } catch (err) {
      console.error('Registration failed:', err)
      if (win) win.close()
      setError('Failed to save the link. Please try again.')
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
        We detected a WhatsApp link. Open it to receive the message, then click the link in the message.
        <strong>Copy the final URL from your browser's address bar</strong> and paste it below.
      </p>

      <button 
        type="button" 
        onClick={handleOpenWhatsApp} 
        className={styles.openButton}
        disabled={!whatsappUrl}
      >
        Open WhatsApp
      </button>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="url"
          value={realUrl}
          onChange={(e) => setRealUrl(e.target.value)}
          placeholder="Paste the final browser URL here"
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
