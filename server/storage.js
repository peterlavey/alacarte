import 'dotenv/config'
// Storage facade selecting backend by environment variables
// USE_DB=memory (default) | mongo

const useDb = (process.env.USE_DB || 'memory').toLowerCase()

let backend
if (useDb === 'mongo') {
  backend = await import('./storage.mongo.js')
} else {
  backend = await import('./storage.memory.js')
}

export const initStorage = backend.initStorage
export const closeStorage = backend.closeStorage
export const saveRecord = backend.saveRecord
export const getAllRecords = backend.getAllRecords
export const findNearestRecord = backend.findNearestRecord
