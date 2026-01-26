import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { resolve, register } from '@/api'
import axios from 'axios'
import SplashScreen from '@/components/SplashScreen/SplashScreen'
import { isWhatsAppUrl } from '@/utils/whatsapp'
import ContentSection from './components/ContentSection'
import UnavailableSection from './components/UnavailableSection'
import ScannerSection from './components/ScannerSection'
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
  const [isScanningNew, setIsScanningNew] = useState(false)
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
    if (coords && !content && !isScanningNew) {
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
            setIsScanningNew(false)

            // If content is a URL, open it in a new tab
            if (contentValue.startsWith('http')) {
              // Open window immediately to avoid popup blocker
              const win = window.open('about:blank', '_blank')

              if (!win) {
                setInvalidUrl(contentValue)
                setErrorType('redirectFailed')
                setMenuUnavailable(true)
                return
              }

              if (win) win.close()
              window.open(contentValue, '_blank')
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
  }, [coords, content, isScanningNew])

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
        if (!win) {
          setInvalidUrl(scannedText)
          setErrorType('redirectFailed')
          setMenuUnavailable(true)
          setShowScanner(false)
          setLoading(false)
          isRegistering.current = false
          return
        }
      }

      // NEW: Check if it's a WhatsApp URL
      if (isWhatsAppUrl(scannedText)) {
        if (win) win.close()
        setLoading(false)
        isRegistering.current = false
        navigate('/whatsapp-link', { state: { lat: coords.lat, lon: coords.lon, whatsappUrl: scannedText } })
        return
      }

      const data = await register({
        ...coords,
        content: scannedText,
      })
      const finalContent = data.content || scannedText
      setContent(finalContent)
      setIsScanningNew(false)
      setShowScanner(false)
      setMenuUnavailable(false)
      setErrorType(null)
      setInvalidUrl(null)
      setLoading(false)

      // If content is a URL, open it in a new tab
      if (finalContent.startsWith('http')) {
        if (win) win.close()
        window.open(finalContent, '_blank')
      } else {
        if (win) win.close()
      }
    } catch (err: unknown) {
      console.error('Registration failed:', err)
      // IF IT IS AN AXIOS ERROR WITH A 422 STATUS, IT'S A VALIDATION FAILURE
      if (axios.isAxiosError(err) && err.response && err.response.status === 422) {
        console.log('Validation error detected (422)')
        setErrorType('redirectFailed')
        setInvalidUrl(scannedText)
      } else {
        setErrorType('notFound') 
      }
      setMenuUnavailable(true)
      setShowScanner(false)
      setIsScanningNew(false)
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
      <div className={`${styles.container} wood-background`}>
        <p className={styles.error}>{error}</p>
        <button onClick={getLocation} className={styles.button}>Retry</button>
      </div>
    )
  }

  return (
    <div className={`${styles.container} wood-background fade-in`}>
      {content && !menuUnavailable ? (
        <ContentSection 
          content={content} 
          onScanAnother={() => { 
            setContent(null); 
            setIsScanningNew(true);
            setShowScanner(true);
          }} 
        />
      ) : menuUnavailable && !showScanner ? (
        <UnavailableSection 
          errorType={errorType}
          invalidUrl={invalidUrl}
          onScanClick={() => setShowScanner(true)}
        />
      ) : showScanner ? (
        <ScannerSection 
          onScan={handleScan}
          onError={(err: Error) => setError(err.message)}
          onCancel={() => {
            setShowScanner(false)
            if (isScanningNew) {
              setIsScanningNew(false)
              getLocation() // Re-trigger location check to show previous content
            }
          }}
          title={isScanningNew ? 'Scan Different QR' : 'Scan QR'}
        />
      ) : null}
    </div>
  )
}
