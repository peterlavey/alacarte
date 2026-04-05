import { Router } from 'express'
import { findNearbyRestaurant } from '../utils/googlePlaces.js'

const router = Router()

// POST /api/resolve — finds nearest restaurant using Google Places API
router.post('/resolve', async (req, res) => {
  const { lat, lon, thresholdMeters } = req.body || {}

  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return res.status(400).json({ error: 'lat and lon must be numbers' })
  }

  const threshold = typeof thresholdMeters === 'number' ? thresholdMeters : 40 // default 40m
  console.log(`Searching for nearest restaurant via Google Places: [${lat}, ${lon}] (threshold: ${threshold}m)`);
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    console.warn('GOOGLE_MAPS_API_KEY is not configured.');
    return res.status(500).json({ error: 'Search service not configured' });
  }

  const googlePlaces = await findNearbyRestaurant(lat, lon, threshold);
  
  if (!googlePlaces || googlePlaces.length === 0) {
    console.log(`No restaurant found for [${lat}, ${lon}] within ${threshold}m`);
    return res.status(404).json({ error: 'No restaurant found within threshold' })
  }

  const primaryPlace = googlePlaces[0];
  console.log(`Found ${googlePlaces.length} restaurants. Primary: "${primaryPlace.name}" at [${primaryPlace.lat}, ${primaryPlace.lon}]`);
  
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const candidates = googlePlaces.map(p => ({
    ...p,
    photo_url: p.photo_reference ? `https://places.googleapis.com/v1/${p.photo_reference}/media?maxHeightPx=400&maxWidthPx=400&key=${apiKey}` : null
  }));

  return res.json({ content: primaryPlace.content, record: candidates[0], candidates })
})

export default router
