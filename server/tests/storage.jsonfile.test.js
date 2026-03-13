import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import fs from 'fs/promises'
import path from 'path'

const testFilePath = path.join(process.cwd(), 'test_database.json')
process.env.STORAGE_FILE_PATH = testFilePath
process.env.USE_DB = 'jsonfile'
process.env.NETLIFY = 'true'

let storage
let jsonfile

beforeEach(async () => {
  // Reset modules to ensure clean state and environment variable pickup
  vi.resetModules()
  storage = await import('../repositories/storage/index.js')
  jsonfile = await import('../repositories/storage/jsonfile.js')
  await jsonfile.__clearAll()
  await storage.initStorage()
})

afterEach(async () => {
  await storage.closeStorage()
  try {
    await fs.unlink(testFilePath)
  } catch (e) {
    // Ignore if file doesn't exist
  }
})

describe('jsonfile storage backend', () => {
  it('initStorage creates file if not exists', async () => {
    try { await fs.unlink(testFilePath) } catch(e) {}
    await storage.initStorage()
    const exists = await fs.access(testFilePath).then(() => true).catch(() => false)
    expect(exists).toBe(true)
    const content = await fs.readFile(testFilePath, 'utf-8')
    expect(JSON.parse(content)).toEqual([])
  })

  it('saveRecord persists to file', async () => {
    const rec = { lat: 10, lon: 20, content: 'test', createdAt: new Date().toISOString() }
    await storage.saveRecord(rec)
    
    const fileContent = await fs.readFile(testFilePath, 'utf-8')
    const savedRecords = JSON.parse(fileContent)
    expect(savedRecords.length).toBe(1)
    expect(savedRecords[0].content).toBe('test')
  })

  it('getAllRecords returns all records from file', async () => {
    const rec1 = { lat: 10, lon: 20, content: 'test1', createdAt: new Date().toISOString() }
    const rec2 = { lat: 30, lon: 40, content: 'test2', createdAt: new Date().toISOString() }
    await storage.saveRecord(rec1)
    await storage.saveRecord(rec2)
    
    const all = await storage.getAllRecords()
    expect(all.length).toBe(2)
    expect(all.map(r => r.content)).toContain('test1')
    expect(all.map(r => r.content)).toContain('test2')
  })

  it('findNearestRecord finds record in file', async () => {
    const now = new Date().toISOString()
    await storage.saveRecord({ lat: 40.0, lon: -74.0, content: 'A', createdAt: now })
    
    const result = await storage.findNearestRecord(40.0001, -74.0001, 100)
    expect(result).toBeTruthy()
    expect(result.content).toBe('A')
  })

  it('reloads data from file on init', async () => {
    const rec = { lat: 10, lon: 20, content: 'persistent', createdAt: new Date().toISOString() }
    await storage.saveRecord(rec)
    
    // Simulate restart by clearing in-memory records and re-initializing
    await jsonfile.initStorage() // This should reload from the same file
    
    const all = await storage.getAllRecords()
    expect(all.length).toBe(1)
    expect(all[0].content).toBe('persistent')
  })
})
