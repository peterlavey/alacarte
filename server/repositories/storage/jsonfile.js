import fs from 'fs/promises'
import path from 'path'
import { getDistanceFromLatLonInMeters } from '../../utils/geo.js'

// File-based storage backend using a JSON file
const filePath = process.env.STORAGE_FILE_PATH || path.join(process.cwd(), 'database.json')
let records = []

export async function initStorage() {
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    records = JSON.parse(data)
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If the file doesn't exist, start with an empty array
      records = []
      await saveToFile()
    } else {
      console.error('Error loading storage file:', error)
      throw error
    }
  }
}

async function saveToFile() {
  try {
    const dir = path.dirname(filePath)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(filePath, JSON.stringify(records, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error saving storage file:', error)
    throw error
  }
}

export async function closeStorage() {
  await saveToFile()
}

// Save a new record: { lat, lon, content, createdAt }
export async function saveRecord(record) {
  records.push(record)
  await saveToFile()
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
export async function __clearAll() {
  records = []
  await saveToFile()
}
