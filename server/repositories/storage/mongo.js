import {MongoClient} from 'mongodb'
import {getDistanceFromLatLonInMeters} from '../../utils/geo.js'

let client
let db
let collection

export async function initStorage() {
  const url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017'
  const dbName = process.env.MONGO_DB || 'alacarte'
  client = new MongoClient(url)
  await client.connect()
  db = client.db(dbName)
  collection = db.collection('records')
}

export async function closeStorage() {
  if (client) await client.close()
}

export async function saveRecord(record) {
  const doc = { ...record }
  await collection.insertOne(doc)
  return doc
}

export async function getAllRecords() {
  return await collection.find({}, {sort: {createdAt: -1}}).toArray()
}

export async function findNearestRecord(lat, lon, thresholdMeters) {
  // Optimization: filter by the first two decimal places (~1.1km grid)
  // using a range query to keep it efficient at the DB level
  const margin = 0.01
  const candidates = await collection
    .find({
      lat: { $gte: lat - margin, $lte: lat + margin },
      lon: { $gte: lon - margin, $lte: lon + margin },
    })
    .toArray()

  let nearest = null
  let minDist = Infinity
  for (const rec of candidates) {
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
