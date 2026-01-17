import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import Home from '../Home'
import * as api from '@/api'
import axios from 'axios'
import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('@/api', () => ({
  resolve: vi.fn(),
  register: vi.fn(),
}))

vi.mock('axios')

// Mock Scanner component to avoid issues with @yudiel/react-qr-scanner in jsdom
vi.mock('@/components/Scanner/Scanner', () => ({
  default: ({ onDecode }: { onDecode: (result: unknown) => void }) => (
    <div data-testid="mock-scanner">
      <button onClick={() => onDecode('scanned-content')}>Simulate Scan</button>
      <button onClick={() => onDecode('https://google.com')}>Simulate URL Scan</button>
      <button onClick={() => onDecode('https://drive.google.com/file/d/invalid')}>Simulate Invalid GDrive Scan</button>
    </div>
  ),
}))

vi.mock('@/components/SplashScreen/SplashScreen', () => {
  const MockSplash = ({ fadeOut, onAnimationEnd }: { fadeOut: boolean, onAnimationEnd: () => void }) => {
    React.useEffect(() => {
      if (fadeOut && onAnimationEnd) {
        onAnimationEnd()
      }
    }, [fadeOut, onAnimationEnd])
    return <div data-testid="splash-screen">{fadeOut ? 'Fading Out' : 'Alacarte'}</div>
  }
  return {
    default: MockSplash,
  }
})

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Home Page', () => {
  const mockCoords = {
    latitude: 40.7128,
    longitude: -74.006,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
    
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
    
    expect(screen.getByText(/Alacarte/i)).toBeInTheDocument()
    
    await waitFor(() => {
      expect(api.resolve).toHaveBeenCalledWith({
        lat: mockCoords.latitude,
        lon: mockCoords.longitude,
      })
    })
    
    expect(screen.getByText(/Found Content/i)).toBeInTheDocument()
    expect(screen.getByText(/some content/i)).toBeInTheDocument()
  })

  it('shows unavailable message if no content is found at location', async () => {
    vi.mocked(api.resolve).mockResolvedValue({ content: null })
    
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText(/Menu not available/i)).toBeInTheDocument()
    })
    
    expect(screen.queryByTestId('mock-scanner')).not.toBeInTheDocument()
    
    fireEvent.click(screen.getByText(/Scan QR code/i))
    expect(screen.getByTestId('mock-scanner')).toBeInTheDocument()
  })

  it('calls register when a QR code is scanned', async () => {
    vi.mocked(api.resolve).mockResolvedValue({ content: null })
    vi.mocked(api.register).mockResolvedValue({ content: 'newly registered content' })
    
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText(/Menu not available/i)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText(/Scan QR code/i))
    
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

  it('does not call register if URL validation fails in handleScan', async () => {
    vi.mocked(api.resolve).mockResolvedValue({ content: null })
    vi.mocked(axios.get).mockRejectedValue(new Error('Validation failed'))
    
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText(/Menu not available/i)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText(/Scan QR code/i))
    
    await waitFor(() => {
      expect(screen.getByTestId('mock-scanner')).toBeInTheDocument()
    })
    
    // Simulate scanning a URL
    fireEvent.click(screen.getByText(/Simulate URL Scan/i))
    
    await waitFor(() => {
      expect(screen.getByText(/Redirect failed/i)).toBeInTheDocument()
      expect(screen.getByText(/URL:/i)).toBeInTheDocument()
      expect(screen.getByText(new RegExp('https://google.com', 'i'))).toBeInTheDocument()
    })
    
    expect(api.register).not.toHaveBeenCalled()
  })

  it('does not call register if Google Drive validation returns 404 in handleScan', async () => {
    const invalidUrl = 'https://drive.google.com/file/d/invalid'
    vi.mocked(api.resolve).mockResolvedValue({ content: null })
    // Simulate axios returning a response with 404 status (which axios normally throws for by default)
    const error404 = {
      isAxiosError: true,
      response: { status: 404, data: 'Not Found' }
    }
    vi.mocked(axios.get).mockRejectedValue(error404)
    
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText(/Menu not available/i)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText(/Scan QR code/i))
    
    await waitFor(() => {
      expect(screen.getByTestId('mock-scanner')).toBeInTheDocument()
    })
    
    // Simulate scanning an invalid Google Drive URL
    fireEvent.click(screen.getByText(/Simulate Invalid GDrive Scan/i))
    
    await waitFor(() => {
      expect(screen.getByText(/Redirect failed/i)).toBeInTheDocument()
      expect(screen.getByText(/URL:/i)).toBeInTheDocument()
      expect(screen.getByText(new RegExp(invalidUrl, 'i'))).toBeInTheDocument()
    })
    
    expect(api.register).not.toHaveBeenCalled()
  })

  it('shows unavailable message if registration fails', async () => {
    vi.mocked(api.resolve).mockResolvedValue({ content: null })
    vi.mocked(api.register).mockRejectedValue(new Error('Registration failed'))
    
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText(/Menu not available/i)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText(/Scan QR code/i))
    fireEvent.click(screen.getByText(/Simulate Scan/i))
    
    await waitFor(() => {
      expect(screen.getByText(/Menu not available/i)).toBeInTheDocument()
    })
  })

  it('redirects to URL in a new tab if content is a link (resolve)', async () => {
    const url = 'https://example.com'
    vi.mocked(api.resolve).mockResolvedValue({ content: url })
    const openSpy = vi.fn()
    const originalOpen = window.open
    window.open = openSpy

    try {
      render(<Home />)

      await waitFor(() => {
        expect(openSpy).toHaveBeenCalledWith(url, '_blank')
      })
    } finally {
      window.open = originalOpen
    }
  })

  it('redirects to URL in a new tab if content is a link (register)', async () => {
    const url = 'https://example.com/registered'
    vi.mocked(api.resolve).mockResolvedValue({ content: null })
    vi.mocked(api.register).mockResolvedValue({ content: url })
    
    const openSpy = vi.fn().mockReturnValue({}) // Mock successful window.open
    const originalOpen = window.open
    window.open = openSpy

    try {
      render(<Home />)

      await waitFor(() => {
        expect(screen.getByText(/Menu not available/i)).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText(/Scan QR code/i))

      await waitFor(() => {
        expect(screen.getByTestId('mock-scanner')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText(/Simulate Scan/i))

      await waitFor(() => {
        expect(openSpy).toHaveBeenCalledWith(url, '_blank')
      })
    } finally {
      window.open = originalOpen
    }
  })

  it('shows unavailable message if window.open returns null (popup blocked)', async () => {
    const url = 'https://example.com'
    vi.mocked(api.resolve).mockResolvedValue({ content: url })
    const openSpy = vi.fn().mockReturnValue(null) // Mock blocked popup
    const originalOpen = window.open
    window.open = openSpy

    try {
      render(<Home />)

      await waitFor(() => {
        expect(screen.getByText(/Redirect failed/i)).toBeInTheDocument()
        expect(screen.getByText(/URL:/i)).toBeInTheDocument()
        expect(screen.getByText(new RegExp(url, 'i'))).toBeInTheDocument()
      })
      
      expect(screen.getByText(/could not open it/i)).toBeInTheDocument()
    } finally {
      window.open = originalOpen
    }
  })

  it('validates Google Drive URL before redirecting', async () => {
    const url = 'https://drive.google.com/file/d/123'
    vi.mocked(api.resolve).mockResolvedValue({ content: url })
    vi.mocked(axios.get).mockResolvedValue({ status: 200 })
    
    const openSpy = vi.fn().mockReturnValue({})
    const originalOpen = window.open
    window.open = openSpy

    try {
      render(<Home />)

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(url, expect.any(Object))
        expect(openSpy).toHaveBeenCalledWith(url, '_blank')
      })
    } finally {
      window.open = originalOpen
    }
  })

  it('shows unavailable message if Google Drive validation fails', async () => {
    const url = 'https://drive.google.com/file/d/invalid'
    vi.mocked(api.resolve).mockResolvedValue({ content: url })
    vi.mocked(axios.get).mockRejectedValue(new Error('Not Found'))
    
    const openSpy = vi.fn()
    const originalOpen = window.open
    window.open = openSpy

    try {
      render(<Home />)

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(url, expect.any(Object))
        expect(screen.getByText(/Redirect failed/i)).toBeInTheDocument()
        expect(screen.getByText(/URL:/i)).toBeInTheDocument()
        expect(screen.getByText(new RegExp(url, 'i'))).toBeInTheDocument()
        expect(screen.getByText(/could not open it/i)).toBeInTheDocument()
        expect(openSpy).not.toHaveBeenCalled()
      })
    } finally {
      window.open = originalOpen
    }
  })
})
