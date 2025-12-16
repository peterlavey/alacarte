import React, { useEffect } from 'react'

// Gets current geolocation once on mount and emits via callbacks
export default function GeoHandler({ onCoords, onError }) {
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      onError && onError(new Error('Geolocation not supported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords || {}
        onCoords && onCoords({ lat: latitude, lon: longitude })
      },
      (err) => {
        onError && onError(err)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  return null
}
