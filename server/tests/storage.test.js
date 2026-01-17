import { describe, it, expect, beforeEach, vi } from 'vitest'

// Ensure memory backend and avoid server listen side-effects
process.env.USE_DB = 'memory'
process.env.NETLIFY = 'true'

describe('storage facade with memory backend', () => {
  let storage
  let mem

  beforeEach(async () => {
    storage = await import('../repositories/storage/index.js')
    mem = await import('../repositories/storage/memory.js')
    mem.__clearAll()
    await storage.initStorage()
  })

  it('initStorage/closeStorage do not throw', async () => {
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

  it('findNearestRecord within and beyond threshold', async () => {
    const now = new Date().toISOString()
    await storage.saveRecord({ lat: 40.0, lon: -74.0, content: 'A', createdAt: now })
    await storage.saveRecord({ lat: 40.0003, lon: -74.0003, content: 'B', createdAt: now })

    const qLat = 40.00015
    const qLon = -74.00015
    const near = await storage.findNearestRecord(qLat, qLon, 100)
    expect(near).toBeTruthy()
    expect(['A', 'B']).toContain(near.content)

    const far = await storage.findNearestRecord(1, 1, 50)
    expect(far).toBeNull()
  })
})

describe('mongo backend is selectable (mocked)', () => {
  it('delegates to ./mongo.js when USE_DB=mongo', async () => {
    const original = process.env.USE_DB
    process.env.USE_DB = 'mongo'

    vi.resetModules()
    // Define mock inline to avoid referencing hoisted outer variables
    vi.mock('../repositories/storage/mongo.js', () => {
      const calls = { init: 0, close: 0, save: [], getAll: 0, find: [] }
      return {
        initStorage: async () => { calls.init++ },
        closeStorage: async () => { calls.close++ },
        saveRecord: async (r) => { calls.save.push(r); return r },
        getAllRecords: async () => { calls.getAll++; return [] },
        findNearestRecord: async (lat, lon, th) => { calls.find.push([lat, lon, th]); return null },
        __calls: calls,
      }
    })

    const storage = await import('../repositories/storage/index.js')
    const mockedMongo = await import('../repositories/storage/mongo.js')

    await storage.initStorage()
    await storage.saveRecord({ a: 1 })
    await storage.getAllRecords()
    await storage.findNearestRecord(1, 2, 3)
    await storage.closeStorage()

    const calls = mockedMongo.__calls
    expect(calls.init).toBe(1)
    expect(calls.close).toBe(1)
    expect(calls.save.length).toBe(1)
    expect(calls.getAll).toBe(1)
    expect(calls.find.length).toBe(1)

    process.env.USE_DB = original
  })
})
