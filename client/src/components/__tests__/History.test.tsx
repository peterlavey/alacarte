import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import History from '@/components/History/History'

describe('History', () => {
  it('renders empty state when no records', () => {
    render(<History records={[]} />)
    expect(screen.getByText(/No history yet/i)).toBeInTheDocument()
  })
})
