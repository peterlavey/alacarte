import 'dotenv/config'

// Storage facade selecting backend by environment variables
// USE_DB=memory (default) | mongo

const useDb = (process.env.USE_DB || 'memory').toLowerCase()

let backendPromise
async function getBackend() {
  if (!backendPromise) {
    backendPromise = (async () => {
      if (useDb === 'mongo') {
        return await import('./mongo.js')
      }
      return await import('./memory.js')
    })()
  }
  return backendPromise
}

export async function initStorage() {
  const backend = await getBackend()
  if (typeof backend.initStorage === 'function') {
    return backend.initStorage()
  }
}

export async function closeStorage() {
  const backend = await getBackend()
  if (typeof backend.closeStorage === 'function') {
    return backend.closeStorage()
  }
}

export async function saveRecord(record) {
  const backend = await getBackend()
  return backend.saveRecord(record)
}

export async function getAllRecords() {
  const backend = await getBackend()
  return backend.getAllRecords()
}

export async function findNearestRecord(lat, lon, thresholdMeters) {
  const backend = await getBackend()
  return backend.findNearestRecord(lat, lon, thresholdMeters)
}
