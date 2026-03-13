import { Router } from 'express'
import health from './health.js'
import resolve from './resolve.js'

const router = Router()

// Mount individual route modules under /api/* paths
router.use(health)
router.use(resolve)

export default router
