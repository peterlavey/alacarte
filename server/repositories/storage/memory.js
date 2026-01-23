import { getDistanceFromLatLonInMeters } from '../../utils/geo.js'

// In-memory storage backend
const records = []

export async function initStorage() {
  // nothing to init for memory
}

export async function closeStorage() {
  // nothing to close
}

// Save a new record: { lat, lon, content, createdAt }
export async function saveRecord(record) {
  records.push(record)
  return record
}

// Return all stored records
export async function getAllRecords() {
  return [...records]
}

// Find the nearest record to the given lat/lon within threshold (meters)
// Returns the record augmented with { distance } if found, else null
export async function findNearestRecord(lat, lon, thresholdMeters) {
  let nearest = null
  let minDist = Infinity

  // Optimization: filter by the first two decimal places (approx 1.1km grid)
  const gridLat = Math.floor(lat * 100) / 100
  const gridLon = Math.floor(lon * 100) / 100

  // We check the current grid and adjacent grids to be safe, 
  // as the threshold could cross grid boundaries.
  // 0.01 degree is ~1.1km, so checking the immediate neighbors 
  // is plenty for a 30m-100m threshold.
  const candidates = records.filter((rec) => {
    return Math.abs(rec.lat - lat) <= 0.01 && Math.abs(rec.lon - lon) <= 0.01
  })

  for (const rec of candidates) {
    const d = getDistanceFromLatLonInMeters(lat, lon, rec.lat, rec.lon)
    if (d < minDist) {
      minDist = d
      nearest = rec
    }
  }

  if (nearest && minDist <= thresholdMeters) {
    return { ...nearest, distance: minDist }
  }
  return null
}

// For testing
export function __clearAll() {
  records.length = 0
}
