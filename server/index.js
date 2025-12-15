import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { getDistanceFromLatLonInMeters } from './utils/geo.js'
import { initStorage, closeStorage } from './storage/index.js'
import apiRoutes from './routes/index.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3001

// Ensure storage is initialized exactly once (works for server and serverless)
let storageReadyPromise
export async function ensureStorage() {
  if (!storageReadyPromise) {
    storageReadyPromise = initStorage()
  }
  return storageReadyPromise
}

// Middleware
app.use(cors())
app.use(bodyParser.json())

// API routes
app.use('/api', apiRoutes)

if (process.env.NETLIFY !== 'true') {
  // Avoid top-level await for CJS bundlers; initialize before starting server
  ensureStorage().then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`)
    })

    async function shutdown(signal) {
      console.log(`\n${signal} received. Shutting down...`)
      server.close(async () => {
        await closeStorage().catch(() => {})
        process.exit(0)
      })
    }

    process.on('SIGINT', () => shutdown('SIGINT'))
    process.on('SIGTERM', () => shutdown('SIGTERM'))
  })
}

// Export utility for completeness (optional usage elsewhere)
export { getDistanceFromLatLonInMeters }
export default app
