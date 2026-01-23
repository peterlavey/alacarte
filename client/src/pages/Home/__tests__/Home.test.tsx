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
    
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument()
    expect(screen.getByText(/some content/i)).toBeInTheDocument()
  })

  it('shows unavailable message if no content is found at location', async () => {
    vi.mocked(api.resolve).mockResolvedValue({ content: null })
    
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText(/Discover Your Menu/i)).toBeInTheDocument()
    })
    
    expect(screen.getByAltText(/Not found/i)).toBeInTheDocument()
    
    expect(screen.queryByTestId('mock-scanner')).not.toBeInTheDocument()
    
    fireEvent.click(screen.getByText(/Scan QR code/i))
    expect(screen.getByTestId('mock-scanner')).toBeInTheDocument()
  })

  it('calls register when a QR code is scanned', async () => {
    vi.mocked(api.resolve).mockResolvedValue({ content: null })
    vi.mocked(api.register).mockResolvedValue({ content: 'newly registered content' })
    
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText(/Discover Your Menu/i)).toBeInTheDocument()
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
    
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument()
    expect(screen.getByText(/newly registered content/i)).toBeInTheDocument()
  })

  it('shows Redirect failed if registration fails with validation error (422)', async () => {
    const invalidUrl = 'https://google.com'
    vi.mocked(api.resolve).mockResolvedValue({ content: null })
    const validationError = new Error('Validation failed')
    // @ts-expect-error adding response to error
    validationError.response = { status: 422, data: { error: 'Validation failed' } }
    // @ts-expect-error adding isAxiosError to error
    validationError.isAxiosError = true
    vi.mocked(api.register).mockRejectedValue(validationError)
    vi.spyOn(window, 'open').mockReturnValue({ close: vi.fn() } as unknown as Window)
    
    // Explicitly mock axios.isAxiosError to return true for our validationError
    vi.spyOn(axios, 'isAxiosError').mockImplementation((err) => err === validationError)
    
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText(/Discover Your Menu/i)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText(/Scan QR code/i))
    
    await waitFor(() => {
      expect(screen.getByTestId(/mock-scanner/i)).toBeInTheDocument()
    })
    
    // Simulate scanning a URL
    fireEvent.click(screen.getByText(/Simulate URL Scan/i))
    
    await waitFor(() => {
      expect(api.register).toHaveBeenCalled()
    })

    await waitFor(() => {
      const title = screen.getByRole('heading', { level: 1 })
      expect(title).toHaveTextContent(/Menu Unavailable/i)
    }, { timeout: 10000 })
    
    expect(screen.getByText(new RegExp(invalidUrl, 'i'))).toBeInTheDocument()
  })

  it('shows unavailable message if registration fails', async () => {
    vi.mocked(api.resolve).mockResolvedValue({ content: null })
    vi.mocked(api.register).mockRejectedValue(new Error('Registration failed'))
    
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText(/Discover Your Menu/i)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText(/Scan QR code/i))
    fireEvent.click(screen.getByText(/Simulate Scan/i))
    
    await waitFor(() => {
      expect(screen.getByText(/Discover Your Menu/i)).toBeInTheDocument()
    })
  })

  it('redirects to URL in a new tab if content is a link (resolve)', async () => {
    const url = 'https://example.com'
    vi.mocked(api.resolve).mockResolvedValue({ content: url })
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => {
        return { location: { href: '' }, close: vi.fn() } as unknown as Window;
    });

    try {
      render(<Home />)

      await waitFor(() => {
        expect(openSpy).toHaveBeenCalled()
      }, { timeout: 15000 })
    } finally {
      openSpy.mockRestore()
    }
  }, 25000)

  it('redirects to URL in a new tab if content is a link (register)', async () => {
    const url = 'https://example.com/registered'
    vi.mocked(api.resolve).mockResolvedValue({ content: null })
    vi.mocked(api.register).mockResolvedValue({ content: url })
    
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => {
        return { location: { href: '' }, close: vi.fn() } as unknown as Window;
    });

    try {
      render(<Home />)

      await waitFor(() => {
        expect(screen.getByText(/Discover Your Menu/i)).toBeInTheDocument()
      }, { timeout: 15000 })

      fireEvent.click(screen.getByText(/Scan QR code/i))

      await waitFor(() => {
        expect(screen.getByTestId(/mock-scanner/i)).toBeInTheDocument()
      }, { timeout: 15000 })

      fireEvent.click(screen.getByText(/Simulate URL Scan/i))

      await waitFor(() => {
        expect(openSpy).toHaveBeenCalled()
      }, { timeout: 15000 })
    } finally {
      openSpy.mockRestore()
    }
  }, 25000)

  it('shows unavailable message if window.open returns null (popup blocked)', async () => {
    const url = 'https://example.com'
    vi.mocked(api.resolve).mockResolvedValue({ content: url })
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null) // Mock blocked popup

    try {
      render(<Home />)

      await waitFor(() => {
        expect(screen.getByText(/Menu Unavailable/i)).toBeInTheDocument()
      }, { timeout: 15000 })
      
      expect(screen.getByText(/seems unreachable/i)).toBeInTheDocument()
    } finally {
      openSpy.mockRestore()
    }
  }, 25000)

  it('shows unavailable message if registration fails with validation error', async () => {
    vi.mocked(api.resolve).mockResolvedValue({ content: null })
    const validationError = new Error('Validation failed')
    // @ts-expect-error adding response to error
    validationError.response = { status: 422, data: { error: 'Validation failed' } }
    // @ts-expect-error adding isAxiosError to error
    validationError.isAxiosError = true
    vi.mocked(api.register).mockRejectedValue(validationError)
    
    // Explicitly mock axios.isAxiosError to return true for our validationError
    vi.spyOn(axios, 'isAxiosError').mockImplementation((err) => err === validationError)

    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => {
        return { location: { href: '' }, close: vi.fn() } as unknown as Window;
    });

    try {
      render(<Home />)
      
      await waitFor(() => {
        expect(screen.getByText(/Discover Your Menu/i)).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText(/Scan QR code/i))
      fireEvent.click(screen.getByText(/Simulate URL Scan/i))
      
      await waitFor(() => {
        expect(api.register).toHaveBeenCalled()
      })

      await waitFor(() => {
        const title = screen.getByRole('heading', { level: 1 })
        expect(title).toHaveTextContent(/Menu Unavailable/i)
      }, { timeout: 10000 })
      
    } finally {
      openSpy.mockRestore()
    }
  })

  it('allows scanning a different QR code after finding a location', async () => {
    vi.mocked(api.resolve).mockResolvedValue({ content: 'initial content' })
    vi.mocked(api.register).mockResolvedValue({ content: 'new content' })
    
    render(<Home />)
    
    // 1. Initial resolution
    await waitFor(() => {
      expect(screen.getByText(/initial content/i)).toBeInTheDocument()
    })
    
    // 2. Click "Scan different QR"
    fireEvent.click(screen.getByText(/Scan different QR/i))
    
    // 3. Verify scanner is shown with correct title
    expect(screen.getByTestId('mock-scanner')).toBeInTheDocument()
    expect(screen.getByText(/Scan Different QR/i)).toBeInTheDocument()
    
    // 4. Simulate a new scan
    fireEvent.click(screen.getByText(/Simulate Scan/i))
    
    // 5. Verify registration and new content
    await waitFor(() => {
      expect(api.register).toHaveBeenCalled()
      expect(screen.getByText(/new content/i)).toBeInTheDocument()
    })
    
    // Verify resolve was NOT called again while scanning new
    // (it should have been called only once initially)
    expect(api.resolve).toHaveBeenCalledTimes(1)
  })
})
