import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import Canvas from '../Canvas'

describe('Canvas', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('renders "No content" when content is null', () => {
    render(<Canvas content={null} />)
    expect(screen.getByText(/No content/i)).toBeInTheDocument()
  })

  it('renders string content correctly', () => {
    const content = 'Hello World'
    render(<Canvas content={content} />)
    expect(screen.getByText(content)).toBeInTheDocument()
  })

  it('renders object content as prettified JSON', () => {
    const content = { foo: 'bar', baz: 123 }
    render(<Canvas content={content} />)
    const expected = JSON.stringify(content, null, 2)
    const pre = screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'pre'
    })
    expect(pre.textContent).toBe(expected)
  })
})
