import { describe, it, expect } from 'vitest'
import { isWhatsAppUrl } from '../whatsapp'

describe('isWhatsAppUrl', () => {
  it('identifies direct WhatsApp domains', () => {
    expect(isWhatsAppUrl('https://wa.me/123456789')).toBe(true)
    expect(isWhatsAppUrl('https://api.whatsapp.com/send?phone=123')).toBe(true)
    expect(isWhatsAppUrl('https://web.whatsapp.com')).toBe(true)
  })

  it('identifies known redirection services', () => {
    expect(isWhatsAppUrl('https://link.cheetrack.com/on_tap_providencia_qr_p1_4')).toBe(true)
  })

  it('rejects non-WhatsApp domains', () => {
    expect(isWhatsAppUrl('https://google.com')).toBe(false)
    expect(isWhatsAppUrl('https://example.com/wa.me')).toBe(false)
    expect(isWhatsAppUrl('not-a-url')).toBe(false)
  })

  it('handles empty or null input', () => {
    expect(isWhatsAppUrl('')).toBe(false)
    // @ts-expect-error needed to test null input
    expect(isWhatsAppUrl(null)).toBe(false)
  })
})
