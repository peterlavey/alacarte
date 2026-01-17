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
  const [errorType, setErrorType] = useState<'notFound' | 'redirectFailed' | null>(null)
  const [invalidUrl, setInvalidUrl] = useState<string | null>(null)
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
      setLoading(true)
      resolve(coords)
        .then(async (data: { content: string }) => {
          if (data && data.content) {
            const contentValue = data.content
            setContent(contentValue)
            setShowScanner(false)
            setMenuUnavailable(false)
            setErrorType(null)
            setInvalidUrl(null)

            // If content is a URL, open it in a new tab
            if (contentValue.startsWith('http')) {
              // Open window immediately to avoid popup blocker
              const win = window.open('about:blank', '_blank')

              // If it's a Google Drive URL, validate it first
              if (contentValue.includes('drive.google.com')) {
                try {
                  setLoading(true)
                  await axios.get(contentValue, { 
                    timeout: 10000,
                    // We don't need the whole content, just checking if it's accessible
                    headers: { 
                      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                      'Accept-Language': 'en-US,en;q=0.9',
                    },
                    validateStatus: (status) => (status >= 200 && status < 400) || status === 403
                  })
                } catch (err) {
                  console.error('Google Drive validation failed:', err)
                  if (win) win.close()
                  setInvalidUrl(contentValue)
                  setErrorType('redirectFailed')
                  setMenuUnavailable(true)
                  return
                } finally {
                  setLoading(false)
                }
              }

              if (win && win.location) {
                win.location.href = contentValue
              } else if (!win) {
                setInvalidUrl(contentValue)
                setErrorType('redirectFailed')
                setMenuUnavailable(true)
              }
            }
          } else {
            setErrorType('notFound')
            setMenuUnavailable(true)
          }
        })
        .catch((err: never) => {
          console.error('Resolve error:', err)
          setErrorType('notFound')
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

      // Open window early if it's likely a URL to avoid popup blocker
      // We'll close it if it's not a URL or if validation fails
      let win: Window | null = null
      if (scannedText.startsWith('http') && !isWhatsAppUrl(scannedText)) {
        win = window.open('about:blank', '_blank')
      }

      // NEW: Check if it's a WhatsApp URL
      if (isWhatsAppUrl(scannedText)) {
        if (win) win.close()
        setLoading(false)
        isRegistering.current = false
        navigate('/whatsapp-link', { state: { lat: coords.lat, lon: coords.lon, whatsappUrl: scannedText } })
        return
      }

      // Validate URL before registering if it starts with http
      if (scannedText.startsWith('http')) {
        try {
          await axios.get(scannedText, { 
            timeout: 10000,
            headers: { 
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
              'Accept-Language': 'en-US,en;q=0.9',
            },
            validateStatus: (status) => (status >= 200 && status < 400) || status === 403
          })
        } catch (err) {
          console.error('URL validation failed before registration:', err)
          if (win) win.close()
          setInvalidUrl(scannedText)
          setErrorType('redirectFailed')
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
      setErrorType(null)
      setInvalidUrl(null)
      setLoading(false)

      // If content is a URL, open it in a new tab
      if (finalContent.startsWith('http')) {
        if (win && win.location) {
          win.location.href = finalContent
        } else {
          const secondWin = window.open(finalContent, '_blank')
          if (!secondWin && !win) {
            setInvalidUrl(finalContent)
            setErrorType('redirectFailed')
            setMenuUnavailable(true)
          }
        }
      } else {
        if (win) win.close()
      }
    } catch (err: unknown) {
      console.error('Registration failed:', err)
      setErrorType('notFound') 
      setMenuUnavailable(true)
      setShowScanner(false)
      setLoading(false)
      const message = err instanceof Error ? err.message : 'Failed to register'
      console.warn('Register error:', message)
    } finally {
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

  if (loading && !content) {
    return (
      <SplashScreen 
        fadeOut={false}
        onAnimationEnd={() => {}}
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
          <h1 className={styles.title}>
            {errorType === 'redirectFailed' ? 'Redirect failed' : 'Menu not available'}
          </h1>
          <p>
            {errorType === 'redirectFailed' 
              ? 'We found a menu but could not open it. Please try scanning again.' 
              : "We couldn't find a menu for this location."}
          </p>
          {invalidUrl && (
            <p className={styles.invalidUrl}>
              URL: <code>{invalidUrl}</code>
            </p>
          )}
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
