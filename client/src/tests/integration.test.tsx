import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home/Home'
import WhatsAppLinkRequest from '../pages/WhatsAppLinkRequest/WhatsAppLinkRequest'
// Mock Axios
vi.mock('axios', async (importActual) => {
  const actual: unknown = await importActual()
  const mockAxios = vi.fn(async (config: { method?: string, url?: string, data?: unknown }) => {
    if (config.method?.toUpperCase() === 'POST') {
      return mockAxios.post(config.url, config.data)
    }
    if (config.method?.toUpperCase() === 'GET') {
      return mockAxios.get(config.url)
    }
    return { status: 200, data: {} }
  }) as unknown as any; // Using any for mock object properties
  mockAxios.post = vi.fn()
  mockAxios.get = vi.fn()
  mockAxios.create = vi.fn().mockReturnValue(mockAxios)
  mockAxios.defaults = { headers: { common: {} } }
  mockAxios.isAxiosError = (err: { response?: unknown }) => !!err.response
  
  // Directly mock the axios instance used by axios internal dispatch
  // This is a bit hacky but helps avoid some JSDom issues
  mockAxios.request = mockAxios
  
  return {
    ...(actual as object),
    default: mockAxios,
    post: mockAxios.post,
    get: mockAxios.get,
    create: mockAxios.create,
    isAxiosError: mockAxios.isAxiosError
  }
})
import axios from 'axios'
import { vi, describe, it, expect, beforeEach, beforeAll } from 'vitest'
import app from '../../../server/index.js'
import { __clearAll } from '../../../server/repositories/storage/memory.js'
import { setAxiosInstance } from '@/api'

vi.mock('../../../server/utils/validation.js', () => ({
  validateUrl: vi.fn().mockResolvedValue(true)
}))

// Mock Scanner component
vi.mock('@/components/Scanner/Scanner', () => ({
  default: ({ onDecode }: { onDecode: (result: unknown) => void }) => (
    <div data-testid="mock-scanner">
      <button onClick={() => onDecode('https://www.intrinsical.cl/pages/brewpub?srsltid=AfmBOoqaTWdhypoBhEV618aAEk1g6Gy25txIBc3Y969X_RJbKyLM900k')}>
        Scan Valid URL
      </button>
      <button onClick={() => onDecode('https://drive.google.com/file/d/invalid')}>
        Scan Invalid GDrive URL
      </button>
      <button onClick={() => onDecode('https://link.cheetrack.com/on_tap_providencia_qr_p1_4')}>
        Scan WhatsApp URL
      </button>
    </div>
  ),
}))

// Mock SplashScreen
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

describe('Integration Flows (Client + Server)', () => {
  const mockCoords = {
    latitude: -33.4489,
    longitude: -70.6693,
  }

  beforeAll(async () => {
    process.env.NODE_ENV = 'test'
    process.env.USE_DB = 'memory'
    // Ensure we use memory storage
    const storage = await import('../../../server/repositories/storage/index.js')
    await storage.initStorage()
  })

  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules() // Add this
    document.body.innerHTML = ''
    __clearAll()
    
    // Stub XMLHttpRequest to prevent network calls and bypass JSDom CORS
    const MockXHR = vi.fn().mockImplementation(function() {
      return {
        open: vi.fn(),
        send: vi.fn(),
        setRequestHeader: vi.fn(),
        readyState: 4,
        status: 200,
        responseText: 'OK',
        onreadystatechange: null,
        onload: null,
        onerror: null,
        getAllResponseHeaders: () => '',
        getResponseHeader: () => null,
      }
    })
    vi.stubGlobal('XMLHttpRequest', MockXHR)
    vi.stubGlobal('fetch', vi.fn())
    
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

    // Mock window.open
    vi.spyOn(window, 'open').mockReturnValue({ location: { href: '' }, close: vi.fn() } as unknown as Window)

    // Mock window.location
    // @ts-expect-error needed to mock window.location
    delete window.location
    // @ts-expect-error needed to mock window.location
    window.location = {
      href: 'http://localhost/',
      pathname: '/',
      assign: vi.fn(),
      replace: vi.fn(),
      reload: vi.fn(),
      toString: () => 'http://localhost/'
    }
    // We can't really mock location.href setter in JSDom easily without some tricks
    // but we can try to use a getter/setter
    let href = 'http://localhost/'
    Object.defineProperty(window.location, 'href', {
      get: () => href,
      set: (v) => { href = v }
    })

    // Create a mock axios instance that calls the Express app
    const postMock = async (url: string, data: unknown) => {
      let path = url
      try {
        if (url.startsWith('http')) {
          path = new URL(url).pathname
        }
      } catch { /* empty */ }
      
      return new Promise((resolve, reject) => {
        const req = {
          url: path,
          method: 'POST',
          body: data,
          headers: { 'content-type': 'application/json' },
          on: vi.fn(),
          resume: vi.fn(),
          pipe: vi.fn(),
          unpipe: vi.fn(),
          listeners: () => [],
          emit: vi.fn(),
        } as unknown as any;
        
        const res = {
          statusCode: 200,
          headersSent: false,
          setHeader: vi.fn(),
          getHeader: vi.fn(),
          removeHeader: vi.fn(),
          status: (code: number) => {
            res.statusCode = code;
            return res;
          },
          json: (body: unknown) => {
            res.headersSent = true
            if (res.statusCode >= 400) {
              reject({ response: { status: res.statusCode, data: body, headers: {} }, isAxiosError: true, config: {} });
            } else {
              resolve({ data: body, status: res.statusCode, headers: {}, config: {} });
            }
          },
          send: (body: unknown) => {
            if (typeof body === 'object') res.json(body)
            else {
              res.headersSent = true
              resolve({ data: body, status: res.statusCode, headers: {}, config: {} })
            }
          },
          end: vi.fn(),
          on: vi.fn(),
          emit: vi.fn(),
          once: vi.fn(),
        } as unknown as any;

        app(req, res);
      });
    };

    const mockApi = {
      post: vi.fn(postMock),
      get: vi.fn(async () => {
         return { status: 200, data: [] }
      }),
      defaults: { headers: { common: {} } },
      interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } }
    } as unknown as any;

    setAxiosInstance(mockApi);

    // Mock axios global to prevent ANY real network calls
    vi.mocked(axios.get).mockImplementation(async () => {
       return { status: 200, data: 'OK', headers: {}, config: {} } as any
    });
    vi.mocked(axios.post).mockImplementation(async (url, data) => {
       if (!url || typeof url !== 'string' || !url.startsWith('http') || url.includes('/api/')) {
         return postMock(url || '', data) as any
       }
       return { status: 200, data: 'OK', headers: {}, config: {} } as any
    });
    vi.mocked(axios.create).mockReturnValue(mockApi);
    (axios as any).isAxiosError = (err: { response?: unknown }) => !!err.response;
  })

  // 1. The happy path, should redirect to a url previously saved
  it('Flow 1: Happy path - redirect to previously saved URL', async () => {
    const savedUrl = 'https://gour.media/krossbar/antofagasta'
    
    // Pre-save record in memory storage
    await axios.post('/api/register', {
      lat: mockCoords.latitude,
      lon: mockCoords.longitude,
      content: savedUrl
    })

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(window.open).toHaveBeenCalledWith('about:blank', '_blank')
    }, { timeout: 10000 })
    
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument()
  })

  // 2. The case when a url doesn't exist for your location, simulate a qr scan and redirect to the url
  it('Flow 2: Unknown location + valid URL scan', async () => {
    const scannedUrl = 'https://www.intrinsical.cl/pages/brewpub?srsltid=AfmBOoqaTWdhypoBhEV618aAEk1g6Gy25txIBc3Y969X_RJbKyLM900k'
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => expect(screen.getByText(/Discover Your Menu/i)).toBeInTheDocument())

    fireEvent.click(screen.getByText(/Scan QR code/i))
    fireEvent.click(screen.getByText(/Scan Valid URL/i))

    await waitFor(() => {
      expect(window.open).toHaveBeenCalledWith('about:blank', '_blank')
    }, { timeout: 10000 })

    expect(screen.getByText(/Welcome/i)).toBeInTheDocument()

    // Verify it was saved in the server by resolving again
    const resolveRes = await axios.post('/api/resolve', {
      lat: mockCoords.latitude,
      lon: mockCoords.longitude
    })
    expect(resolveRes.data.content).toBe(scannedUrl)
  })

  // 3. The case when a url doesn't exist for your location, simulate a qr scan but returns an invalid google drive url
  it('Flow 3: Unknown location + invalid Google Drive URL scan', async () => {
    const invalidGDriveUrl = 'https://drive.google.com/file/d/invalid'
    
    // Mock server-side validation to fail for this URL
    const { validateUrl } = await import('../../../server/utils/validation.js')
    vi.mocked(validateUrl).mockResolvedValueOnce(false)

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => expect(screen.getByText(/Discover Your Menu/i)).toBeInTheDocument())

    fireEvent.click(screen.getByText(/Scan QR code/i))
    fireEvent.click(screen.getByText(/Scan Invalid GDrive URL/i))

    await waitFor(() => {
      expect(screen.getByText(/Menu Unavailable/i)).toBeInTheDocument()
      expect(screen.getByText(/seems unreachable/i)).toBeInTheDocument()
      expect(screen.getByText(new RegExp(invalidGDriveUrl, 'i'))).toBeInTheDocument()
    }, { timeout: 10000 })

    // Verify it was NOT saved
    try {
      await axios.post('/api/resolve', {
        lat: mockCoords.latitude,
        lon: mockCoords.longitude
      })
      throw new Error('Should have failed')
    } catch (err: unknown) {
      const error = err as { response: { status: number } }
      expect(error.response.status).toBe(404)
    }
  })

  // 4. The case when a url doesn't exist for your location, simulate a qr scan but returns a wsp api content
  it('Flow 4: Unknown location + WhatsApp API flow', async () => {
    const correctUrl = 'https://toto.menu/pisouno/menu'
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/whatsapp-link" element={<WhatsAppLinkRequest />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => expect(screen.getByText(/Discover Your Menu/i)).toBeInTheDocument())

    fireEvent.click(screen.getByText(/Scan QR code/i))
    fireEvent.click(screen.getByText(/Scan WhatsApp URL/i))

    // Should navigate to WhatsAppLinkRequest
    await waitFor(() => {
      expect(screen.getByText(/WhatsApp Link Detected/i)).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText(/Paste the final browser URL here/i)
    fireEvent.change(input, { target: { value: correctUrl } })
    
    fireEvent.click(screen.getByText('Continue'))

    await waitFor(() => {
      expect(window.open).toHaveBeenCalledWith('about:blank', '_blank')
    })

    // Verify it was saved
    const resolveRes = await axios.post('/api/resolve', {
      lat: mockCoords.latitude,
      lon: mockCoords.longitude
    })
    expect(resolveRes.data.content).toBe(correctUrl)
  })
})
