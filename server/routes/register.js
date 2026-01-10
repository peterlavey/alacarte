import { Router } from 'express'
import { saveRecord } from '../repositories/storage/index.js'
import { validateUrl } from '../utils/validation.js'

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

  // Validate URL content before saving
  const isValid = await validateUrl(content)
  if (!isValid) {
    return res.status(422).json({ error: 'Invalid content URL' })
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
