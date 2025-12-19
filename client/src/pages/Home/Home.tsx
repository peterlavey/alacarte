import React, { useState, useEffect, useCallback } from 'react'
import { resolve, register } from '@/api'
import Canvas from '@/components/Canvas/Canvas'
import Scanner from '@/components/Scanner/Scanner'
import SplashScreen from '@/components/SplashScreen/SplashScreen'
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
        .then((data: { content: string }) => {
          if (data && data.content) {
            const contentValue = data.content
            setContent(contentValue)
            setShowScanner(false)

            // If content is a URL, open it in a new tab
            if (contentValue.startsWith('http')) {
              window.open(contentValue, '_blank')
            }
          } else {
            setShowScanner(true)
          }
        })
        .catch((err: never) => {
          console.error('Resolve error:', err)
          setShowScanner(true)
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
      const data = await register({
        ...coords,
        content: scannedText,
      })
      const finalContent = data.content || scannedText
      setContent(finalContent)
      setShowScanner(false)

      // If content is a URL, open it in a new tab
      if (finalContent.startsWith('http')) {
        window.open(finalContent, '_blank')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to register'
      setError(message)
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
      {content ? (
        <div className={styles.contentSection}>
          <h1 className={styles.title}>Found Content</h1>
          <Canvas content={content} />
          <button onClick={() => { setContent(null); setShowScanner(true); }} className={styles.button}>
            Scan Another
          </button>
        </div>
      ) : showScanner ? (
        <div className={styles.scannerSection}>
          <h1 className={styles.title}>No content found here</h1>
          <p>Scan a QR code to register this location</p>
          <Scanner 
            active={true} 
            onDecode={handleScan} 
            onError={(err: Error) => setError(err.message)} 
          />
        </div>
      ) : null}
    </div>
  )
}
