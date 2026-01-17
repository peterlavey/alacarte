import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import JsonInput from '../JsonInput'

describe('JsonInput', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('renders correctly', () => {
    render(<JsonInput onSubmit={() => {}} />)
    expect(screen.getByLabelText(/JSON content/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Latitude/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Longitude/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument()
  })

  it('calls onSubmit with parsed JSON and coordinates on valid input', () => {
    const handleSubmit = vi.fn()
    render(<JsonInput onSubmit={handleSubmit} initialLat={10} initialLon={20} />)
    
    const textarea = screen.getByLabelText(/JSON content/i)
    fireEvent.change(textarea, { target: { value: '{"foo": "bar"}' } })
    
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }))
    
    expect(handleSubmit).toHaveBeenCalledWith({ foo: 'bar' }, 10, 20)
    expect(screen.queryByText(/Invalid JSON/i)).not.toBeInTheDocument()
  })

  it('calls onSubmit with manually entered coordinates', () => {
    const handleSubmit = vi.fn()
    render(<JsonInput onSubmit={handleSubmit} />)
    
    fireEvent.change(screen.getByLabelText(/Latitude/i), { target: { value: '15.5' } })
    fireEvent.change(screen.getByLabelText(/Longitude/i), { target: { value: '25.5' } })
    fireEvent.change(screen.getByLabelText(/JSON content/i), { target: { value: '{"test": true}' } })
    
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }))
    
    expect(handleSubmit).toHaveBeenCalledWith({ test: true }, 15.5, 25.5)
  })

  it('calls onSubmit with plain text if not valid JSON', () => {
    const handleSubmit = vi.fn()
    render(<JsonInput onSubmit={handleSubmit} initialLat={10} initialLon={20} />)
    
    const textarea = screen.getByLabelText(/JSON content/i)
    fireEvent.change(textarea, { target: { value: 'plain text content' } })
    
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }))
    
    expect(handleSubmit).toHaveBeenCalledWith('plain text content', 10, 20)
    expect(screen.queryByText(/Invalid JSON/i)).not.toBeInTheDocument()
  })

  it('shows error on invalid coordinates', () => {
    const handleSubmit = vi.fn()
    render(<JsonInput onSubmit={handleSubmit} />)
    
    fireEvent.change(screen.getByLabelText(/Latitude/i), { target: { value: 'not-a-number' } })
    fireEvent.change(screen.getByLabelText(/JSON content/i), { target: { value: '{}' } })
    
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }))
    
    expect(handleSubmit).not.toHaveBeenCalled()
    expect(screen.getByText(/Lat and Lon must be valid numbers/i)).toBeInTheDocument()
  })

  it('is disabled when the disabled prop is true', () => {
    render(<JsonInput onSubmit={() => {}} disabled={true} />)
    expect(screen.getByLabelText(/JSON content/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: /Submit/i })).toBeDisabled()
  })
})
