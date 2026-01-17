import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('supabase backend is selectable (mocked)', () => {
  it('delegates to ./supabase.js when USE_DB=supabase', async () => {
    const originalUseDb = process.env.USE_DB
    const originalUrl = process.env.SUPABASE_URL
    const originalKey = process.env.SUPABASE_KEY
    
    process.env.USE_DB = 'supabase'
    process.env.SUPABASE_URL = 'http://localhost:54321'
    process.env.SUPABASE_KEY = 'mock-key'

    vi.resetModules()
    
    // Mock supabase.js
    vi.mock('../repositories/storage/supabase.js', () => {
      const calls = { init: 0, save: [], getAll: 0, find: [] }
      return {
        initStorage: async () => { calls.init++ },
        saveRecord: async (r) => { calls.save.push(r); return r },
        getAllRecords: async () => { calls.getAll++; return [] },
        findNearestRecord: async (lat, lon, th) => { calls.find.push([lat, lon, th]); return null },
        __calls: calls,
      }
    })

    const storage = await import('../repositories/storage/index.js')
    const mockedSupabase = await import('../repositories/storage/supabase.js')

    await storage.initStorage()
    await storage.saveRecord({ lat: 1, lon: 2, content: 'test' })
    await storage.getAllRecords()
    await storage.findNearestRecord(1, 2, 3)

    const calls = mockedSupabase.__calls
    expect(calls.init).toBe(1)
    expect(calls.save.length).toBe(1)
    expect(calls.save[0]).toEqual({ lat: 1, lon: 2, content: 'test' })
    expect(calls.getAll).toBe(1)
    expect(calls.find.length).toBe(1)

    process.env.USE_DB = originalUseDb
    process.env.SUPABASE_URL = originalUrl
    process.env.SUPABASE_KEY = originalKey
  })
})
