import { Router } from 'express'
import { saveRecord } from '../storage/index.js'

const router = Router()

// POST /api/register
router.post('/register', async (req, res) => {
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

export default router
