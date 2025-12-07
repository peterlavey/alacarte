import axios from 'axios'

// Simple API service for the client
// Base URL can be overridden via Vite env: VITE_API_BASE
const API_BASE = import.meta?.env?.VITE_API_BASE || 'https://registry.gitlab.com/peterlavey/alacarte/server:latest'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

export async function resolve(coords) {
  const { lat, lon, thresholdMeters } = coords || {}
  const { data } = await api.post('/api/resolve', {
    lat,
    lon,
    ...(typeof thresholdMeters === 'number' ? { thresholdMeters } : {}),
  })
  return data
}

export async function register(data) {
  const { lat, lon, content } = data || {}
  const res = await api.post('/api/register', { lat, lon, content })
  return res.data
}

export async function fetchHistory() {
  const { data } = await api.get('/api/history')
  return data
}

export default { resolve, register, fetchHistory }
