import axios from 'axios'

export async function validateUrl(url) {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return true // Not a URL, nothing to validate here
  }

  try {
    await axios.get(url, {
      timeout: 5000,
      headers: { 'Range': 'bytes=0-0' },
      validateStatus: (status) => status >= 200 && status < 400, // Consider 3xx as success for now or handle them
    })
    return true
  } catch (error) {
    console.error(`Validation failed for ${url}:`, error.message)
    return false
  }
}
