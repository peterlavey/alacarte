import { getDistanceFromLatLonInMeters } from './utils/geo.js'

// In-memory storage for simplicity in Phase 2
const records = []

// Save a new record: { lat, lon, content, createdAt }
export function saveRecord(record) {
  records.push(record)
  return record
}

// Return all stored records
export function getAllRecords() {
  return records
}

// Find the nearest record to the given lat/lon within threshold (meters)
// Returns the record augmented with { distance } if found, else null
export function findNearestRecord(lat, lon, thresholdMeters) {
  let nearest = null
  let minDist = Infinity

  for (const rec of records) {
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

// For potential testing/debugging (not used at runtime)
export function __clearAll() {
  records.length = 0
}
