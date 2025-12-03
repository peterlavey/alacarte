import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { getDistanceFromLatLonInMeters } from './utils/geo.js'
import { initStorage, closeStorage, saveRecord, findNearestRecord, getAllRecords } from './storage.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Resolve API — finds nearest record within threshold and returns its content
app.post('/api/resolve', async (req, res) => {
  const { lat, lon, thresholdMeters } = req.body || {}

  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return res.status(400).json({ error: 'lat and lon must be numbers' })
  }

  const threshold = typeof thresholdMeters === 'number' ? thresholdMeters : 50 // default 50m
  const result = await findNearestRecord(lat, lon, threshold)

  if (!result) {
    return res.status(404).json({ error: 'No record found within threshold' })
  }

  return res.json({ content: result.content, record: result })
})

// Register API — store a new record
app.post('/api/register', async (req, res) => {
  const { lat, lon, content } = req.body || {}

  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return res.status(400).json({ error: 'lat and lon must be numbers' })
  }
  if (typeof content === 'undefined') {
    return res.status(400).json({ error: 'content is required' })
  }

  const record = {
    lat,
    lon,
    content,
    createdAt: new Date().toISOString(),
  }

  await saveRecord(record)
  return res.status(201).json({ ok: true, record })
})

// History API — return all records
app.get('/api/history', async (req, res) => {
  res.json({ records: await getAllRecords() })
})

await initStorage()

const server = app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})

async function shutdown(signal) {
  console.log(`\n${signal} received. Shutting down...`)
  server.close(async () => {
    await closeStorage().catch(() => {})
    process.exit(0)
  })
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

// Export utility for completeness (optional usage elsewhere)
export { getDistanceFromLatLonInMeters }
