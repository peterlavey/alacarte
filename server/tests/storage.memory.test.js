import test from 'node:test'
import assert from 'node:assert/strict'

// Ensure we use the memory backend
process.env.USE_DB = 'memory'

// Dynamic imports after setting env
const storage = await import('../storage/index.js')
const mem = await import('../storage/memory.js')

test('initStorage/closeStorage do not throw for memory backend', async () => {
  await assert.doesNotReject(storage.initStorage())
  await assert.doesNotReject(storage.closeStorage())
})

test('saveRecord and getAllRecords', async () => {
  mem.__clearAll()
  await storage.initStorage()

  const rec = { lat: 10, lon: 20, content: { hello: 'world' }, createdAt: new Date().toISOString() }
  await storage.saveRecord(rec)
  const all = await storage.getAllRecords()
  assert.equal(all.length, 1)
  assert.equal(all[0].lat, 10)
  assert.equal(all[0].lon, 20)
  assert.deepEqual(all[0].content, { hello: 'world' })

  await storage.closeStorage()
})

test('findNearestRecord within threshold returns nearest', async () => {
  mem.__clearAll()
  await storage.initStorage()

  const now = new Date().toISOString()
  await storage.saveRecord({ lat: 40.0, lon: -74.0, content: 'A', createdAt: now })
  await storage.saveRecord({ lat: 40.0003, lon: -74.0003, content: 'B', createdAt: now })

  // Query near point between the two
  const qLat = 40.00015
  const qLon = -74.00015
  const result = await storage.findNearestRecord(qLat, qLon, 100) // 100m threshold
  assert.ok(result, 'Expected a nearest record')
  assert.ok(['A', 'B'].includes(result.content))

  await storage.closeStorage()
})

test('findNearestRecord beyond threshold returns null', async () => {
  mem.__clearAll()
  await storage.initStorage()

  const now = new Date().toISOString()
  await storage.saveRecord({ lat: 0, lon: 0, content: 'Origin', createdAt: now })

  const result = await storage.findNearestRecord(1, 1, 50) // ~157km away, threshold 50m
  assert.equal(result, null)

  await storage.closeStorage()
})
