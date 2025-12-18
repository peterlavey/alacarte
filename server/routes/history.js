import { Router } from 'express'
import { getAllRecords } from '../repositories/storage/index.js'

const router = Router()

// GET /api/history — return all records
router.get('/history', async (req, res) => {
  res.json({ records: await getAllRecords() })
})

export default router
