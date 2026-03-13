import { Router } from 'express'
import { findNearestRecord, saveRecord } from '../repositories/storage/index.js'
import { findNearbyRestaurant } from '../utils/googlePlaces.js'

const router = Router()

// POST /api/resolve — finds nearest record within threshold and returns its content
router.post('/resolve', async (req, res) => {
  const { lat, lon, thresholdMeters } = req.body || {}

  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return res.status(400).json({ error: 'lat and lon must be numbers' })
  }

  const threshold = typeof thresholdMeters === 'number' ? thresholdMeters : 30 // default 30m
  let result = await findNearestRecord(lat, lon, threshold)

  // Fallback: If no record in local DB, try Google Places API
  if (!result && process.env.GOOGLE_MAPS_API_KEY) {
    console.log(`Buscando fallback en Google Places para: ${lat}, ${lon}`);
    const googlePlace = await findNearbyRestaurant(lat, lon, threshold);
    
    if (googlePlace) {
      // Registramos automáticamente el lugar encontrado en nuestra DB para caché
      const newRecord = {
        lat: googlePlace.lat,
        lon: googlePlace.lon,
        content: googlePlace.content,
        createdAt: new Date().toISOString(),
        metadata: {
          source: 'google_places',
          name: googlePlace.name,
          place_id: googlePlace.place_id
        }
      };
      
      await saveRecord(newRecord);
      result = newRecord;
    }
  }

  if (!result) {
    return res.status(404).json({ error: 'No record found within threshold' })
  }

  return res.json({ content: result.content, record: result })
})

export default router
