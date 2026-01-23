import { describe, it, expect, beforeEach, afterEach } from 'vitest'

// Ensure we use the memory backend and avoid server listening under tests
process.env.USE_DB = 'memory'
process.env.NETLIFY = 'true'

let storage
let mem

beforeEach(async () => {
  storage = await import('../repositories/storage/index.js')
  mem = await import('../repositories/storage/memory.js')
  mem.__clearAll()
  await storage.initStorage()
})

afterEach(async () => {
  await storage.closeStorage()
})

describe('memory storage backend (migrated from node:test)', () => {
  it('initStorage/closeStorage do not throw for memory backend', async () => {
    await expect(storage.initStorage()).resolves.not.toThrow()
    await expect(storage.closeStorage()).resolves.not.toThrow()
  })

  it('saveRecord and getAllRecords', async () => {
    const rec = { lat: 10, lon: 20, content: { hello: 'world' }, createdAt: new Date().toISOString() }
    await storage.saveRecord(rec)
    const all = await storage.getAllRecords()
    expect(all.length).toBe(1)
    expect(all[0].lat).toBe(10)
    expect(all[0].lon).toBe(20)
    expect(all[0].content).toEqual({ hello: 'world' })
  })

  it('findNearestRecord within threshold returns nearest', async () => {
    const now = new Date().toISOString()
    await storage.saveRecord({ lat: 40.0, lon: -74.0, content: 'A', createdAt: now })
    await storage.saveRecord({ lat: 40.0003, lon: -74.0003, content: 'B', createdAt: now })

    const qLat = 40.00015
    const qLon = -74.00015
    const result = await storage.findNearestRecord(qLat, qLon, 100) // 100m threshold
    expect(result).toBeTruthy()
    expect(['A', 'B']).toContain(result.content)
  })

  it('findNearestRecord beyond threshold returns null', async () => {
    const now = new Date().toISOString()
    await storage.saveRecord({ lat: 0, lon: 0, content: 'Origin', createdAt: now })

    const result = await storage.findNearestRecord(1, 1, 50) // ~157km away, threshold 50m
    expect(result).toBeNull()
  })

  it('findNearestRecord handles grid optimization boundaries', async () => {
    const now = new Date().toISOString()
    // Record at 40.0, 70.0
    await storage.saveRecord({ lat: 40.0, lon: 70.0, content: 'Target', createdAt: now })

    // Query just within the 0.01 margin (0.009 difference)
    const within = await storage.findNearestRecord(40.009, 70.009, 2000) // ~1.4km away, threshold 2000m
    expect(within).toBeTruthy()
    expect(within.content).toBe('Target')

    // Query just outside the 0.01 margin (0.011 difference)
    const outside = await storage.findNearestRecord(40.011, 70.011, 2000)
    expect(outside).toBeNull()
  })

  it('findNearestRecord correctly selects the absolute nearest among multiple close candidates', async () => {
    const now = new Date().toISOString()
    const userLat = 40.7128
    const userLon = -74.006

    // We want locations at specific distances: 20m, 15m, 32m, 13m
    // Roughly, 1 degree is 111,000 meters. 
    // 1 meter is approx 0.000009 degrees.
    
    const mToDeg = 0.000009 

    await storage.saveRecord({ lat: userLat + 20 * mToDeg, lon: userLon, content: '20m', createdAt: now })
    await storage.saveRecord({ lat: userLat + 15 * mToDeg, lon: userLon, content: '15m', createdAt: now })
    await storage.saveRecord({ lat: userLat + 32 * mToDeg, lon: userLon, content: '32m', createdAt: now })
    await storage.saveRecord({ lat: userLat + 13 * mToDeg, lon: userLon, content: '13m', createdAt: now })

    const result = await storage.findNearestRecord(userLat, userLon, 50)
    expect(result).toBeTruthy()
    expect(result.content).toBe('13m')
    // We can also check if the distance is roughly 13m
    expect(result.distance).toBeLessThan(14)
    expect(result.distance).toBeGreaterThan(12)
  })
})
