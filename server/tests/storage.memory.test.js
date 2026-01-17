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
})
