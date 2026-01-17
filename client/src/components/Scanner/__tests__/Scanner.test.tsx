import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Scanner from '../Scanner'

// Mock the third-party scanner component
vi.mock('@yudiel/react-qr-scanner', () => ({
  Scanner: ({ onScan, onError }: { onScan: (res: any) => void, onError: (err: any) => void }) => (
    <div data-testid="mock-qr-scanner">
      <button onClick={() => onScan('mock-scanned-result')}>Trigger Scan</button>
      <button onClick={() => onError(new Error('mock-error'))}>Trigger Error</button>
    </div>
  )
}))

describe('Scanner', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('renders nothing when active is false', () => {
    const { container } = render(<Scanner active={false} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders scanner when active is true', () => {
    render(<Scanner active={true} />)
    expect(screen.getByTestId('mock-qr-scanner')).toBeInTheDocument()
  })

  it('calls onDecode when scanner detects a QR code', () => {
    const handleDecode = vi.fn()
    render(<Scanner active={true} onDecode={handleDecode} />)
    
    fireEvent.click(screen.getByText(/Trigger Scan/i))
    expect(handleDecode).toHaveBeenCalledWith('mock-scanned-result')
  })

  it('calls onError when scanner encounters an error', () => {
    const handleError = vi.fn()
    render(<Scanner active={true} onError={handleError} />)
    
    fireEvent.click(screen.getByText(/Trigger Error/i))
    expect(handleError).toHaveBeenCalledWith(expect.any(Error))
  })

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn()
    render(<Scanner active={true} onClose={handleClose} />)
    
    fireEvent.click(screen.getByRole('button', { name: /Close/i }))
    expect(handleClose).toHaveBeenCalled()
  })
})
