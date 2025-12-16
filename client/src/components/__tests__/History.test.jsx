import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import History from '../History'

describe('History (JS test)', () => {
  it('renders empty state when no records', () => {
    render(<History records={[]} />)
    expect(screen.getByText(/No history yet/i)).toBeInTheDocument()
  })
})
