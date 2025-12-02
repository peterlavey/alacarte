import React, { useEffect, useMemo, useState } from 'react'
import GeoHandler from './components/GeoHandler.jsx'
import JsonInput from './components/JsonInput.jsx'
import Scanner from './components/Scanner.jsx'
import Canvas from './components/Canvas.jsx'
import History from './components/History.jsx'
import { resolve as apiResolve, register as apiRegister, fetchHistory as apiFetchHistory } from './api.js'

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

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', height: '100vh' }}>
      <GeoHandler
        onCoords={(c) => setCoords(c)}
        onError={(err) => {
          setError(err?.message || 'Geolocation error')
          setStatus('error')
        }}
      />

      <aside style={{ borderRight: '1px solid #eee', padding: 12, overflow: 'auto' }}>
        <h3 style={{ marginTop: 0 }}>History</h3>
        <History records={history} onSelect={(r) => setContent(r.content)} />
      </aside>

      <main style={{ padding: 16, display: 'grid', gridTemplateRows: 'auto auto 1fr', gap: 12 }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <strong>Status:</strong> <span>{status}</span>
          {coords && (
            <span style={{ marginLeft: 12, color: '#666' }}>
              @ {coords.lat.toFixed(5)}, {coords.lon.toFixed(5)}
            </span>
          )}
          <span style={{ flex: 1 }} />
          <button type="button" onClick={() => setScannerActive((v) => !v)}>
            {scannerActive ? 'Hide Scanner' : 'Scan QR'}
          </button>
        </header>

        {error && (
          <div style={{ color: 'red' }}>{error}</div>
        )}

        {scannerActive && (
          <Scanner
            active={scannerActive}
            onDecode={handleScanDecode}
            onError={(e) => setError(e?.message || 'Scanner error')}
            onClose={() => setScannerActive(false)}
          />
        )}

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h3>Current Content</h3>
            <Canvas content={content} />
          </div>
          <div>
            <h3>Manual JSON Input</h3>
            <JsonInput onSubmit={handleRegisterContent} disabled={!canRegister} />
            {!canRegister && <div style={{ color: '#666', marginTop: 6 }}>Waiting for location to register content…</div>}
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