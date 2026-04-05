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

interface Candidate {
  name: string
  content: string
  photo_url?: string
}

export default function Home() {
  const [coords, setCoords] = useState<Coords | null>(null)
  const [content, setContent] = useState<unknown>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)
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

  const handleCandidateSelection = useCallback((index: number) => {
    const candidate = candidates[index]
    if (!candidate) return

    setContent(candidate.content)
    setShowConfirmation(false)
    setMenuUnavailable(false)
    setErrorType(null)
    setInvalidUrl(null)

    if (candidate.content.startsWith('http')) {
      const win = window.open('about:blank', '_blank')
      if (!win) {
        setInvalidUrl(candidate.content)
        setErrorType('redirectFailed')
        setMenuUnavailable(true)
        return
      }
      if (win) win.close()
      window.open(candidate.content, '_blank')
    }
  }, [candidates])

  useEffect(() => {
    if (coords && !content && candidates.length === 0) {
      setLoading(true)
      resolve(coords)
        .then(async (data: { content: string, candidates?: Candidate[] }) => {
          if (data && data.candidates && data.candidates.length > 0) {
            setCandidates(data.candidates)
            setShowConfirmation(true)
            setMenuUnavailable(false)
            setErrorType(null)
          } else if (data && data.content) {
            setContent(data.content)
            setMenuUnavailable(false)
            setErrorType(null)
            setInvalidUrl(null)
            if (data.content.startsWith('http')) {
              const win = window.open('about:blank', '_blank')
              if (!win) {
                setInvalidUrl(data.content)
                setErrorType('redirectFailed')
                setMenuUnavailable(true)
                return
              }
              if (win) win.close()
              window.open(data.content, '_blank')
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
  }, [coords, content, candidates.length])

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
      {(content || candidates.length > 0) && !menuUnavailable ? (
        <ContentSection 
          content={content} 
          candidates={candidates}
          showConfirmation={showConfirmation}
          onConfirm={handleCandidateSelection}
          onReject={() => setShowConfirmation(false)}
          onScanAnother={() => { 
            setContent(null); 
            setCandidates([]);
            setShowConfirmation(false);
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
