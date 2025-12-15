import { Router } from 'express'
import { findNearestRecord } from '../storage/index.js'

const router = Router()

// POST /api/resolve — finds nearest record within threshold and returns its content
router.post('/resolve', async (req, res) => {
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

export default router
