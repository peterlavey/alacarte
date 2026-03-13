import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { getDistanceFromLatLonInMeters } from './utils/geo.js'
import apiRoutes from './routes/index.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(bodyParser.json())
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// API routes
app.use('/api', apiRoutes)

if (process.env.NETLIFY !== 'true' && process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
  })

  async function shutdown(signal) {
    console.log(`\n${signal} received. Shutting down...`)
    server.close(async () => {
      process.exit(0)
    })
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

// Export utility for completeness (optional usage elsewhere)
export { getDistanceFromLatLonInMeters }
export default app
