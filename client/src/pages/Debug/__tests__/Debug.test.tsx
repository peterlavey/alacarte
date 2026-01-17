import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import Debug from '../Debug'
import * as api from '@/api'
import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('@/api', () => ({
  resolve: vi.fn(),
  register: vi.fn(),
  fetchHistory: vi.fn(),
}))

// Mock components
vi.mock('@/components/GeoHandler/GeoHandler', () => ({
  default: ({ onCoords }: { onCoords: (c: any) => void }) => {
    React.useEffect(() => {
      onCoords({ lat: 10, lon: 20 })
    }, [onCoords])
    return <div data-testid="geo-handler" />
  }
}))

vi.mock('@/components/Scanner/Scanner', () => ({
  default: () => <div data-testid="scanner" />
}))

vi.mock('@/components/Canvas/Canvas', () => ({
  default: () => <div data-testid="canvas" />
}))

vi.mock('@/components/History/History', () => ({
  default: () => <div data-testid="history" />
}))

vi.mock('@/components/JsonInput/JsonInput', () => ({
  default: ({ onSubmit, initialLat, initialLon }: any) => (
    <div data-testid="json-input">
      <button onClick={() => onSubmit({ test: 'data' }, initialLat, initialLon)}>Submit Mock</button>
      <button onClick={() => onSubmit({ manual: 'data' }, 99, 88)}>Submit Manual Mock</button>
    </div>
  )
}))

describe('Debug Page', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
    vi.mocked(api.fetchHistory).mockResolvedValue({ records: [] })
    vi.mocked(api.resolve).mockResolvedValue({ content: 'resolved' })
    vi.mocked(api.register).mockResolvedValue({ ok: true })
  })

  it('handles content registration from JsonInput with current coords', async () => {
    render(<Debug />)

    await waitFor(() => {
      expect(screen.getByTestId('json-input')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Submit Mock'))

    await waitFor(() => {
      expect(api.register).toHaveBeenCalledWith({
        lat: 10,
        lon: 20,
        content: { test: 'data' }
      })
    })
  })

  it('handles content registration from JsonInput with manual coords', async () => {
    render(<Debug />)

    await waitFor(() => {
      expect(screen.getByTestId('json-input')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Submit Manual Mock'))

    await waitFor(() => {
      expect(api.register).toHaveBeenCalledWith({
        lat: 99,
        lon: 88,
        content: { manual: 'data' }
      })
    })
  })

  it('calls resolve only once when coords are provided', async () => {
    render(<Debug />)

    await waitFor(() => {
      expect(api.resolve).toHaveBeenCalledTimes(1)
    })

    // Wait a bit to see if more calls happen
    await new Promise(r => setTimeout(r, 100))
    expect(api.resolve).toHaveBeenCalledTimes(1)
  })

  it('calls resolve again if coords change', async () => {
    const { rerender } = render(<Debug />)

    await waitFor(() => {
      expect(api.resolve).toHaveBeenCalledTimes(1)
    })

    // Mock geolocation for requestLocation
    const mockGeolocation = {
      getCurrentPosition: vi.fn().mockImplementation((success) =>
        success({
          coords: { latitude: 30, longitude: 40 },
        })
      ),
    }
    vi.stubGlobal('navigator', {
      geolocation: mockGeolocation,
    })

    fireEvent.click(screen.getByRole('button', { name: /Request Location/i }))
    
    await waitFor(() => {
      expect(api.resolve).toHaveBeenCalledTimes(2)
      expect(api.resolve).toHaveBeenLastCalledWith({ lat: 30, lon: 40 })
    })
  })
})
