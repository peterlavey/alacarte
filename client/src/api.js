import axios from 'axios'

// Simple API service for the client
// Base URL can be overridden via Vite env: VITE_API_BASE
const API_BASE = import.meta?.env?.VITE_API_BASE || 'https://alacarte-api.netlify.app'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// For testing purposes: allow overriding the axios instance
export function __setAxiosInstance(instance) {
  // We can't easily re-assign the constant, so we'll use a wrapper
}
let axiosInstance = api
export function setAxiosInstance(instance) {
  axiosInstance = instance
}

export async function resolve(coords) {
  const { lat, lon, thresholdMeters } = coords || {}
  const { data } = await axiosInstance.post('/api/resolve', {
    lat,
    lon,
    ...(typeof thresholdMeters === 'number' ? { thresholdMeters } : {}),
  })
  return data
}

export async function register(data) {
  const { lat, lon, content } = data || {}
  try {
    const res = await axiosInstance.post('/api/register', { lat, lon, content })
    return res.data
  } catch (err) {
    if (err.response && err.response.status === 422) {
      const error = new Error(err.response.data.error || 'Validation failed')
      // @ts-expect-error adding response to error
      error.response = err.response
      // @ts-expect-error adding isAxiosError to error
      error.isAxiosError = true
      throw error
    }
    throw err
  }
}

export async function fetchHistory() {
  const { data } = await axiosInstance.get('/api/history')
  return data
}

export default { resolve, register, fetchHistory }
