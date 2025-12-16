import React, { useEffect, useMemo, useState } from 'react'
import GeoHandler from './components/GeoHandler/GeoHandler'
import JsonInput from './components/JsonInput/JsonInput'
import Scanner from './components/Scanner/Scanner'
import Canvas from './components/Canvas/Canvas'
import History from './components/History/History'
import { resolve as apiResolve, register as apiRegister, fetchHistory as apiFetchHistory } from './api.js'
import styles from './App.module.css'

export default function App() {
  const [status, setStatus] = useState('checking') // checking | found | scanning | idle | error
  const [coords, setCoords] = useState(null)
  const [content, setContent] = useState(null)
  const [history, setHistory] = useState([])
  const [error, setError] = useState('')
  const [scannerActive, setScannerActive] = useState(false)

  // Load history initially
  useEffect(() => {
    apiFetchHistory().then((d) => setHistory(d.records || [])).catch(() => {})
  }, [])

  // When coords available, try resolve nearby
  useEffect(() => {
    async function doResolve() {
      if (!coords) return
      setStatus('checking')
      setError('')
      try {
        const res = await apiResolve(coords)
        setContent(safeParse(res?.content))
        setStatus('found')
      } catch (e) {
        // 404 -> not found; go idle
        if (e?.response?.status === 404) {
          setStatus('idle')
        } else {
          setStatus('error')
          setError(e?.message || 'Failed to resolve')
        }
      }
    }
    doResolve()
  }, [coords])

  const canRegister = useMemo(() => !!coords, [coords])

  async function handleRegisterContent(data) {
    if (!coords) return
    try {
      const payload = { lat: coords.lat, lon: coords.lon, content: data }
      await apiRegister(payload)
      // refresh history
      const h = await apiFetchHistory()
      setHistory(h.records || [])
      setContent(data)
      setStatus('found')
    } catch (e) {
      setError(e?.message || 'Failed to register')
    }
  }

  function handleScanDecode(result) {
    // result may be string; try parse JSON
    let decoded = result
    decoded = safeParse(decoded)
    handleRegisterContent(decoded)
    setScannerActive(false)
  }

  function requestLocation() {
    if (!('geolocation' in navigator)) {
      setError('Geolocation not supported by this browser')
      setStatus('error')
      return
    }
    setStatus('checking')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords || {}
        setCoords({ lat: latitude, lon: longitude })
      },
      (err) => {
        setError(err?.message || 'Failed to get location')
        setStatus('error')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const cameraHelp = (
    <div className="hint">
      Allow camera permission when prompted. If blocked, enable camera access in your browser settings and reload.
    </div>
  )

  return (
    <div className="app-grid">
      <GeoHandler
        onCoords={(c) => setCoords(c)}
        onError={(err) => {
          setError(err?.message || 'Geolocation error')
          setStatus('error')
        }}
      />

      <aside className="sidebar">
        <h3 className={styles.historyTitle}>History</h3>
        <History records={history} onSelect={(r) => setContent(r.content)} />
      </aside>

      <main className="main">
        <header className="topbar">
          <strong>Status:</strong> <span>{status}</span>
          {coords && (
            <span className="coords">
              @ {coords.lat.toFixed(5)}, {coords.lon.toFixed(5)}
            </span>
          )}
          <span className="spacer" />
          <button type="button" onClick={requestLocation} className="btn">
            Request Location
          </button>
          <button type="button" onClick={() => setScannerActive((v) => !v)} className="btn">
            {scannerActive ? 'Hide Scanner' : 'Scan QR'}
          </button>
        </header>

        <div className="permissions">
          <div className="hint">
            Tip: To load nearby content, allow location permission when prompted. You can also tap "Request Location" anytime.
          </div>
          {cameraHelp}
        </div>

        {error && <div className="error">{error}</div>}

        {scannerActive && (
          <Scanner
            active={scannerActive}
            onDecode={handleScanDecode}
            onError={(e) => setError(e?.message || 'Scanner error')}
            onClose={() => setScannerActive(false)}
          />
        )}

        <section className="two-col">
          <div>
            <h3>Current Content</h3>
            <Canvas content={content} />
          </div>
          <div>
            <h3>Manual JSON Input</h3>
            <JsonInput onSubmit={handleRegisterContent} disabled={!canRegister} />
            {!canRegister && <div className={`hint ${styles.waitingHint}`}>Waiting for location to register content…</div>}
          </div>
        </section>
      </main>
    </div>
  )
}

function safeParse(value) {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch (_) {
      return value
    }
  }
  return value
}