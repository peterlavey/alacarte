import { createClient } from '@supabase/supabase-js'
import { getDistanceFromLatLonInMeters } from '../../utils/geo.js'

let supabase

export async function initStorage() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_KEY

  if (!url || !key) {
    throw new Error('SUPABASE_URL and SUPABASE_KEY are required when USE_DB=supabase')
  }

  supabase = createClient(url, key)
}

export async function saveRecord(record) {
  const { data, error } = await supabase
    .from('records')
    .insert([record])
    .select()

  if (error) {
    console.error('Supabase save error:', error)
    throw error
  }
  return data[0]
}

export async function getAllRecords() {
  const { data, error } = await supabase
    .from('records')
    .select('*')
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('Supabase fetch error:', error)
    throw error
  }
  return data
}

export async function findNearestRecord(lat, lon, thresholdMeters) {
  // Supabase doesn't easily support geodistance in the free tier without PostGIS
  // but we can fetch and filter just like the Mongo implementation did
  const all = await getAllRecords()
  let nearest = null
  let minDist = Infinity

  for (const rec of all) {
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
