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
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument()
  })

  it('calls onSubmit with parsed JSON on valid input', () => {
    const handleSubmit = vi.fn()
    render(<JsonInput onSubmit={handleSubmit} />)
    
    const textarea = screen.getByLabelText(/JSON content/i)
    fireEvent.change(textarea, { target: { value: '{"foo": "bar"}' } })
    
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }))
    
    expect(handleSubmit).toHaveBeenCalledWith({ foo: 'bar' })
    expect(screen.queryByText(/Invalid JSON/i)).not.toBeInTheDocument()
  })

  it('shows error on invalid JSON', () => {
    const handleSubmit = vi.fn()
    render(<JsonInput onSubmit={handleSubmit} />)
    
    const textarea = screen.getByLabelText(/JSON content/i)
    fireEvent.change(textarea, { target: { value: 'invalid json' } })
    
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }))
    
    expect(handleSubmit).not.toHaveBeenCalled()
    expect(screen.getByText(/Invalid JSON/i, { selector: 'div' })).toBeInTheDocument()
  })

  it('is disabled when the disabled prop is true', () => {
    render(<JsonInput onSubmit={() => {}} disabled={true} />)
    expect(screen.getByLabelText(/JSON content/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: /Submit/i })).toBeDisabled()
  })
})
