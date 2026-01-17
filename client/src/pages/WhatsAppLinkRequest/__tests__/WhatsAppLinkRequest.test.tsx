import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import WhatsAppLinkRequest from '../WhatsAppLinkRequest'
import * as api from '@/api'
import axios from 'axios'

vi.mock('@/api', () => ({
  register: vi.fn(),
}))

vi.mock('axios')

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('WhatsAppLinkRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
    // Mock window.location.href
    // @ts-expect-error needed to test location.href setter
    delete window.location
    // @ts-expect-error needed to test location.href setter
    window.location = { href: '' }
  })

  it('renders correctly with coordinates and WhatsApp URL', () => {
    render(
      <MemoryRouter initialEntries={[{ state: { lat: 10, lon: 20, whatsappUrl: 'https://wa.me/123' } }]}>
        <WhatsAppLinkRequest />
      </MemoryRouter>
    )

    expect(screen.getByText(/WhatsApp Link Detected/i)).toBeInTheDocument()
    expect(screen.getByText(/Open WhatsApp/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Paste the final browser URL here/i)).toBeInTheDocument()
  })

  it('opens WhatsApp link when clicking the button', () => {
    const windowSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    
    render(
      <MemoryRouter initialEntries={[{ state: { lat: 10, lon: 20, whatsappUrl: 'https://wa.me/123' } }]}>
        <WhatsAppLinkRequest />
      </MemoryRouter>
    )

    const openBtn = screen.getByText(/Open WhatsApp/i)
    fireEvent.click(openBtn)

    expect(windowSpy).toHaveBeenCalledWith('https://wa.me/123', '_blank')
    windowSpy.mockRestore()
  })

  it('shows error if coordinates are missing', () => {
    render(
      <MemoryRouter initialEntries={[{ state: {} }]}>
        <WhatsAppLinkRequest />
      </MemoryRouter>
    )

    expect(screen.getByText(/Missing Information/i)).toBeInTheDocument()
  })

  it('validates URL and registers successfully', async () => {
    vi.mocked(api.register).mockResolvedValueOnce({ id: '1' })
    const openSpy = vi.spyOn(window, 'open').mockReturnValue({ location: { href: '' } } as any)

    render(
      <MemoryRouter initialEntries={[{ state: { lat: 10, lon: 20 } }]}>
        <WhatsAppLinkRequest />
      </MemoryRouter>
    )

    const input = screen.getByPlaceholderText(/Paste the final browser URL here/i)
    fireEvent.change(input, { target: { value: 'https://real-link.com' } })
    
    const submitBtn = screen.getByText('Continue')
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(api.register).toHaveBeenCalledWith({
        lat: 10,
        lon: 20,
        content: 'https://real-link.com'
      })
      expect(openSpy).toHaveBeenCalledWith('about:blank', '_blank')
    })
    openSpy.mockRestore()
  })

  it('shows error if URL registration fails with validation error', async () => {
    const validationError = new Error('Validation failed')
    // @ts-expect-error adding response to error
    validationError.response = { status: 422, data: { error: 'Validation failed' } }
    // @ts-expect-error adding isAxiosError to error
    validationError.isAxiosError = true
    vi.mocked(api.register).mockRejectedValueOnce(validationError)
    vi.spyOn(window, 'open').mockReturnValue({ close: vi.fn() } as any)

    render(
      <MemoryRouter initialEntries={[{ state: { lat: 10, lon: 20 } }]}>
        <WhatsAppLinkRequest />
      </MemoryRouter>
    )

    const input = screen.getByPlaceholderText(/Paste the final browser URL here/i)
    fireEvent.change(input, { target: { value: 'https://bad-link.com' } })
    
    fireEvent.click(screen.getByText('Continue'))

    await waitFor(() => {
      const title = screen.getByRole('heading', { level: 1 })
      expect(title).toBeInTheDocument() // just ensuring it's there
    }, { timeout: 10000 })

    expect(screen.getByText(/The link you provided is not accessible/i)).toBeInTheDocument()
  })
})
