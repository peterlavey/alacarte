import { Router } from 'express'
import { findNearbyRestaurant } from '../utils/googlePlaces.js'

const router = Router()

// POST /api/resolve — finds nearest restaurant using Google Places API
router.post('/resolve', async (req, res) => {
  const { lat, lon, thresholdMeters } = req.body || {}

  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return res.status(400).json({ error: 'lat and lon must be numbers' })
  }

  const threshold = typeof thresholdMeters === 'number' ? thresholdMeters : 50 // default 50m
  console.log(`Searching for nearest restaurant via Google Places: [${lat}, ${lon}] (threshold: ${threshold}m)`);
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    console.warn('GOOGLE_MAPS_API_KEY is not configured.');
    return res.status(500).json({ error: 'Search service not configured' });
  }

  const googlePlace = await findNearbyRestaurant(lat, lon, threshold);
  
  if (!googlePlace) {
    console.log(`No restaurant found for [${lat}, ${lon}] within ${threshold}m`);
    return res.status(404).json({ error: 'No restaurant found within threshold' })
  }

  console.log(`Found restaurant: "${googlePlace.name}" at [${googlePlace.lat}, ${googlePlace.lon}]`);
  return res.json({ content: googlePlace.content, record: googlePlace })
})

export default router
