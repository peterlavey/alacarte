import { describe, it, expect } from 'vitest'
import { getDistanceFromLatLonInMeters } from '../utils/geo.js'

describe('getDistanceFromLatLonInMeters', () => {
  it('returns 0 for identical points', () => {
    const d = getDistanceFromLatLonInMeters(0, 0, 0, 0)
    expect(d).toBeCloseTo(0, 10)
  })

  it('computes known regression distance (approx NYC blocks)', () => {
    const d = getDistanceFromLatLonInMeters(40.0, -74.0, 40.0003, -74.0003)
    expect(d).toBeGreaterThan(0)
    expect(d).toBeLessThan(50)
  })

  it('handles large distances (near antipodal)', () => {
    const d = getDistanceFromLatLonInMeters(0, 0, 0, 180)
    expect(d).toBeGreaterThan(1_000_000)
  })

  it('is numerically stable for tiny deltas', () => {
    const d = getDistanceFromLatLonInMeters(10, 10, 10.000001, 10.000001)
    expect(d).toBeGreaterThan(0)
    expect(d).toBeLessThan(0.2) // < 20 cm
  })
})
