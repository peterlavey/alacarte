import { describe, it, expect, vi } from 'vitest'
import { validateUrl } from '../utils/validation.js'
import axios from 'axios'

vi.mock('axios')

describe('validateUrl', () => {
  it('returns true for non-URLs', async () => {
    expect(await validateUrl('not a url')).toBe(true)
    expect(await validateUrl(123)).toBe(true)
    expect(await validateUrl(null)).toBe(true)
  })

  it('returns true for valid URLs', async () => {
    vi.mocked(axios.get).mockResolvedValue({ status: 200 })
    expect(await validateUrl('https://google.com')).toBe(true)
  })

  it('returns false for 404 URLs', async () => {
    vi.mocked(axios.get).mockRejectedValue({ response: { status: 404 } })
    expect(await validateUrl('https://google.com/404')).toBe(false)
  })

  it('returns false for timeout/network error', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('timeout'))
    expect(await validateUrl('https://slow-site.com')).toBe(false)
  })
})
