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

// For testing
export function __clearAll() {
  records.length = 0
}
