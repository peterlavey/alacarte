import React, { useState, useEffect, useCallback } from 'react'
import { resolve, register } from '@/api'
import Canvas from '@/components/Canvas/Canvas'
import Scanner from '@/components/Scanner/Scanner'
import styles from './Home.module.css'

interface Coords {
  lat: number
  lon: number
}

export default function Home() {
  const [coords, setCoords] = useState<Coords | null>(null)
  const [content, setContent] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showScanner, setShowScanner] = useState(false)

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
    if (coords) {
      resolve(coords)
        .then((data) => {
          if (data && data.content) {
            setContent(data.content)
            setShowScanner(false)
          } else {
            setShowScanner(true)
          }
        })
        .catch((err) => {
          console.error('Resolve error:', err)
          setShowScanner(true)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [coords])

  const handleScan = async (result: unknown) => {
    if (!coords || !result) return
    
    // Extract text from result. The @yudiel/react-qr-scanner result might be an object or string
    let scannedText: string | undefined

    if (typeof result === 'string') {
      scannedText = result
    } else if (Array.isArray(result) && result[0] && typeof result[0].rawValue === 'string') {
      scannedText = result[0].rawValue
    }

    if (!scannedText) return

    try {
      setLoading(true)
      const data = await register({
        ...coords,
        content: scannedText,
      })
      setContent(data.content || scannedText)
      setShowScanner(false)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to register'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !showScanner) {
    return <div className={styles.container}>Loading...</div>
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
