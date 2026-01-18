import { useEffect } from 'react'

interface Coords {
  lat: number
  lon: number
}

interface GeoHandlerProps {
  onCoords?: (coords: Coords) => void
  onError?: (err: Error | GeolocationPositionError) => void
}

// Gets current geolocation once on mount and emits via callbacks
export default function GeoHandler({ onCoords, onError }: GeoHandlerProps) {
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      if (onError) onError(new Error('Geolocation not supported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords || {}
        if (onCoords) onCoords({ lat: latitude, lon: longitude })
      },
      (err) => {
        if (onError) onError(err)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [onCoords, onError])

  return null
}
