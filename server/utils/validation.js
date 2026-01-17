import axios from 'axios'

export async function validateUrl(url) {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return true // Not a URL, nothing to validate here
  }

  try {
    await axios.get(url, {
      timeout: 10000,
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      validateStatus: (status) => (status >= 200 && status < 400) || status === 403, 
    })
    return true
  } catch (error) {
    console.error(`Validation failed for ${url}:`, error.message)
    return false
  }
}
