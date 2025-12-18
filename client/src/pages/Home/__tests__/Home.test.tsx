import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import Home from '../Home'
import * as api from '@/api'
import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('@/api', () => ({
  resolve: vi.fn(),
  register: vi.fn(),
}))

// Mock Scanner component to avoid issues with @yudiel/react-qr-scanner in jsdom
vi.mock('@/components/Scanner/Scanner', () => ({
  default: ({ onDecode }: { onDecode: (result: unknown) => void }) => (
    <div data-testid="mock-scanner">
      <button onClick={() => onDecode('scanned-content')}>Simulate Scan</button>
    </div>
  ),
}))

describe('Home Page', () => {
  const mockCoords = {
    latitude: 40.7128,
    longitude: -74.006,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock navigator.geolocation
    const mockGeolocation = {
      getCurrentPosition: vi.fn().mockImplementation((success) =>
        success({
          coords: mockCoords,
        })
      ),
    }
    vi.stubGlobal('navigator', {
      geolocation: mockGeolocation,
    })
  })

  it('renders loading state initially and then calls resolve', async () => {
    vi.mocked(api.resolve).mockResolvedValue({ content: 'some content' })
    
    render(<Home />)
    
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument()
    
    await waitFor(() => {
      expect(api.resolve).toHaveBeenCalledWith({
        lat: mockCoords.latitude,
        lon: mockCoords.longitude,
      })
    })
    
    expect(screen.getByText(/Found Content/i)).toBeInTheDocument()
    expect(screen.getByText(/some content/i)).toBeInTheDocument()
  })

  it('shows scanner if no content is found at location', async () => {
    vi.mocked(api.resolve).mockResolvedValue({ content: null })
    
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText(/No content found here/i)).toBeInTheDocument()
    })
    
    expect(screen.getByTestId('mock-scanner')).toBeInTheDocument()
  })

  it('calls register when a QR code is scanned', async () => {
    vi.mocked(api.resolve).mockResolvedValue({ content: null })
    vi.mocked(api.register).mockResolvedValue({ content: 'newly registered content' })
    
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByTestId('mock-scanner')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText(/Simulate Scan/i))
    
    await waitFor(() => {
      expect(api.register).toHaveBeenCalledWith({
        lat: mockCoords.latitude,
        lon: mockCoords.longitude,
        content: 'scanned-content',
      })
    })
    
    expect(screen.getByText(/Found Content/i)).toBeInTheDocument()
    expect(screen.getByText(/newly registered content/i)).toBeInTheDocument()
  })
})
