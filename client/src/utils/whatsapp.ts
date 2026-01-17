export function isWhatsAppUrl(url: string): boolean {
  if (!url) return false
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.toLowerCase()
    return host === 'wa.me' || host === 'api.whatsapp.com' || host.endsWith('.whatsapp.com')
  } catch {
    return false
  }
}
