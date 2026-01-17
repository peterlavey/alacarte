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
    // Mock window.location.href
    // @ts-expect-error needed to test location.href setter
    delete window.location
    // @ts-expect-error needed to test location.href setter
    window.location = { href: '' }
  })

  it('renders correctly with coordinates', () => {
    render(
      <MemoryRouter initialEntries={[{ state: { lat: 10, lon: 20 } }]}>
        <WhatsAppLinkRequest />
      </MemoryRouter>
    )

    expect(screen.getByText(/WhatsApp Link Detected/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/your-real-link/i)).toBeInTheDocument()
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
    vi.mocked(axios.get).mockResolvedValueOnce({ status: 200 })
    vi.mocked(api.register).mockResolvedValueOnce({ id: '1' })

    render(
      <MemoryRouter initialEntries={[{ state: { lat: 10, lon: 20 } }]}>
        <WhatsAppLinkRequest />
      </MemoryRouter>
    )

    const input = screen.getByPlaceholderText(/your-real-link/i)
    fireEvent.change(input, { target: { value: 'https://real-link.com' } })
    
    const submitBtn = screen.getByText('Continue')
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://real-link.com', expect.any(Object))
      expect(api.register).toHaveBeenCalledWith({
        lat: 10,
        lon: 20,
        content: 'https://real-link.com'
      })
      expect(window.location.href).toBe('https://real-link.com')
    })
  })

  it('shows error if URL validation fails', async () => {
    vi.mocked(axios.get).mockRejectedValueOnce(new Error('Failed'))

    render(
      <MemoryRouter initialEntries={[{ state: { lat: 10, lon: 20 } }]}>
        <WhatsAppLinkRequest />
      </MemoryRouter>
    )

    const input = screen.getByPlaceholderText(/your-real-link/i)
    fireEvent.change(input, { target: { value: 'https://bad-link.com' } })
    
    fireEvent.click(screen.getByText('Continue'))

    await waitFor(() => {
      expect(screen.getByText(/The link you provided is not accessible/i)).toBeInTheDocument()
    })
    expect(api.register).not.toHaveBeenCalled()
  })
})
