import { Router } from 'express'
import health from './health.js'
import register from './register.js'
import resolve from './resolve.js'
import history from './history.js'

const router = Router()

// Mount individual route modules under /api/* paths
router.use(health)
router.use(register)
router.use(resolve)
router.use(history)

export default router
