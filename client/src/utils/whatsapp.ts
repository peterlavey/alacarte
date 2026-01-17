export function isWhatsAppUrl(url: string): boolean {
  if (!url) return false
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.toLowerCase()
    
    // Direct WhatsApp domains
    if (host === 'wa.me' || host === 'api.whatsapp.com' || host.endsWith('.whatsapp.com')) {
      return true
    }

    // Known redirection services that lead to WhatsApp
    return host === 'link.cheetrack.com';


  } catch {
    return false
  }
}
