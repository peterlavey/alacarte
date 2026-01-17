import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { resolve, register } from '@/api'
import axios from 'axios'
import Canvas from '@/components/Canvas/Canvas'
import Scanner from '@/components/Scanner/Scanner'
import SplashScreen from '@/components/SplashScreen/SplashScreen'
import { isWhatsAppUrl } from '@/utils/whatsapp'
import styles from './Home.module.css'

interface Coords {
  lat: number
  lon: number
}

export default function Home() {
  const [coords, setCoords] = useState<Coords | null>(null)
  const [content, setContent] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [splashVisible, setSplashVisible] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showScanner, setShowScanner] = useState(false)
  const [menuUnavailable, setMenuUnavailable] = useState(false)
  const navigate = useNavigate()
  const isRegistering = React.useRef(false)

  const getLocation = useCallback(() => {
    setLoading(true)
    setError(null)
    if (!('geolocation' in navigator)) {
      setError('Geolocation not supported')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        })
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  useEffect(() => {
    getLocation()
  }, [getLocation])

  useEffect(() => {
    if (coords && !content) {
      resolve(coords)
        .then(async (data: { content: string }) => {
          if (data && data.content) {
            const contentValue = data.content
            setContent(contentValue)
            setShowScanner(false)
            setMenuUnavailable(false)

            // If content is a URL, open it in a new tab
            if (contentValue.startsWith('http')) {
              // If it's a Google Drive URL, validate it first
              if (contentValue.includes('drive.google.com')) {
                try {
                  setLoading(true)
                  await axios.get(contentValue, { 
                    timeout: 5000,
                    // We don't need the whole content, just checking if it's accessible
                    headers: { 'Range': 'bytes=0-0' } 
                  })
                } catch (err) {
                  console.error('Google Drive validation failed:', err)
                  setMenuUnavailable(true)
                  return
                } finally {
                  setLoading(false)
                }
              }

              const win = window.open(contentValue, '_blank')
              if (!win) {
                setMenuUnavailable(true)
              }
            }
          } else {
            setMenuUnavailable(true)
          }
        })
        .catch((err: never) => {
          console.error('Resolve error:', err)
          setMenuUnavailable(true)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [coords, content])

  const handleScan = async (result: unknown) => {
    if (!coords || !result || isRegistering.current) return
    
    isRegistering.current = true

    // Extract text from result. The @yudiel/react-qr-scanner result might be an object or string
    let scannedText: string | undefined

    if (typeof result === 'string') {
      scannedText = result
    } else if (Array.isArray(result) && result[0] && typeof result[0].rawValue === 'string') {
      scannedText = result[0].rawValue
    }

    if (!scannedText) {
      isRegistering.current = false
      return
    }

    try {
      setLoading(true)

      // NEW: Check if it's a WhatsApp URL
      if (isWhatsAppUrl(scannedText)) {
        setLoading(false)
        isRegistering.current = false
        navigate('/whatsapp-link', { state: { lat: coords.lat, lon: coords.lon } })
        return
      }

      // Validate URL before registering if it starts with http
      if (scannedText.startsWith('http')) {
        try {
          await axios.get(scannedText, { 
            timeout: 5000,
            headers: { 'Range': 'bytes=0-0' }
          })
        } catch (err) {
          console.error('URL validation failed before registration:', err)
          setMenuUnavailable(true)
          setShowScanner(false)
          setLoading(false)
          isRegistering.current = false
          return
        }
      }

      const data = await register({
        ...coords,
        content: scannedText,
      })
      const finalContent = data.content || scannedText
      setContent(finalContent)
      setShowScanner(false)
      setMenuUnavailable(false)

      // If content is a URL, open it in a new tab
      if (finalContent.startsWith('http')) {
        const win = window.open(finalContent, '_blank')
        if (!win) {
          setMenuUnavailable(true)
        }
      }
    } catch (err: unknown) {
      console.error('Registration failed:', err)
      setMenuUnavailable(true)
      setShowScanner(false)
      const message = err instanceof Error ? err.message : 'Failed to register'
      // We don't set the global error here to allow showing the menuUnavailable UI
      // but we can log it or show a temporary notification if we had one.
      console.warn('Register error:', message)
    } finally {
      setLoading(false)
      isRegistering.current = false
    }
  }

  if (splashVisible) {
    return (
      <SplashScreen 
        fadeOut={!loading} 
        onAnimationEnd={() => setSplashVisible(false)} 
      />
    )
  }

  if (error && !showScanner && !content) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>{error}</p>
        <button onClick={getLocation} className={styles.button}>Retry</button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {content && !menuUnavailable ? (
        <div className={styles.contentSection}>
          <h1 className={styles.title}>Found Content</h1>
          <Canvas content={content} />
          <button onClick={() => { setContent(null); setMenuUnavailable(true); }} className={styles.button}>
            Scan Another
          </button>
        </div>
      ) : menuUnavailable && !showScanner ? (
        <div className={styles.unavailableSection}>
          <h1 className={styles.title}>Menu not available</h1>
          <p>We couldn't find a menu for this location or the redirect failed.</p>
          <button onClick={() => setShowScanner(true)} className={styles.button}>
            Scan QR code
          </button>
        </div>
      ) : showScanner ? (
        <div className={styles.scannerSection}>
          <h1 className={styles.title}>Scan QR code</h1>
          <p>Scan a QR code to register this location</p>
          <Scanner 
            active={true} 
            onDecode={handleScan} 
            onError={(err: Error) => setError(err.message)} 
          />
          <button onClick={() => setShowScanner(false)} className={styles.secondaryButton}>
            Cancel
          </button>
        </div>
      ) : null}
    </div>
  )
}
