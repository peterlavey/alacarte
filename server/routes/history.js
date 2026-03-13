import { Router } from 'express'
import { getAllRecords } from '../repositories/storage/index.js'

const router = Router()

// GET /api/history — return all records
router.get('/history', async (req, res) => {
  const records = await getAllRecords();
  console.log(`History requested. Returning ${records.length} records.`);
  res.json({ records })
})

export default router
