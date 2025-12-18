import { describe, it, expect, vi, beforeEach } from 'vitest'

// Stable axios mock to avoid module graph churn and memory blowup
vi.mock('axios', () => {
  const post = vi.fn()
  const get = vi.fn()
  const create = vi.fn(() => ({ post, get }))
  return {
    default: { create },
    post,
    get,
    create,
  }
})

import * as axios from 'axios'
import * as api from './api.js'

describe('client api service', () => {
  beforeEach(() => {
    // reset spies between tests without reloading modules
    axios.post.mockReset()
    axios.get.mockReset()
    axios.create.mockClear()
  })

  it('calls POST /api/resolve with coords and optional threshold', async () => {
    axios.post.mockResolvedValue({ data: { content: 'ok' } })
    const res = await api.resolve({ lat: 1, lon: 2, thresholdMeters: 123 })
    expect(res).toEqual({ content: 'ok' })
    expect(axios.post).toHaveBeenCalled()
    const body = axios.post.mock.calls[0][1]
    expect(body).toMatchObject({ lat: 1, lon: 2, thresholdMeters: 123 })
  })

  it('calls POST /api/register with data', async () => {
    axios.post.mockResolvedValue({ data: { ok: true } })
    const res = await api.register({ lat: 1, lon: 2, content: { a: 1 } })
    expect(res).toEqual({ ok: true })
    expect(axios.post).toHaveBeenCalled()
    const [url, body] = axios.post.mock.calls[0]
    expect(url).toBe('/api/register')
    expect(body).toMatchObject({ lat: 1, lon: 2, content: { a: 1 } })
  })

  it('calls GET /api/history', async () => {
    axios.get.mockResolvedValue({ data: { records: [] } })
    const res = await api.fetchHistory()
    expect(res).toEqual({ records: [] })
    expect(axios.get).toHaveBeenCalledWith('/api/history')
  })
})
