import React, { useState, useEffect, useCallback } from 'react'
import { resolve } from '@/api'
import SplashScreen from '@/components/SplashScreen/SplashScreen'
import ContentSection from './components/ContentSection'
import UnavailableSection from './components/UnavailableSection'
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
  const [menuUnavailable, setMenuUnavailable] = useState(false)
  const [errorType, setErrorType] = useState<'notFound' | 'redirectFailed' | null>(null)
  const [invalidUrl, setInvalidUrl] = useState<string | null>(null)

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
            setMenuUnavailable(false)
            setErrorType(null)
            setInvalidUrl(null)

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
  }, [coords, content])

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

  if (error && !content) {
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
            getLocation();
          }} 
        />
      ) : menuUnavailable ? (
        <UnavailableSection 
          errorType={errorType}
          invalidUrl={invalidUrl}
          onRetryClick={() => {
            setMenuUnavailable(false);
            getLocation();
          }}
        />
      ) : null}
    </div>
  )
}
