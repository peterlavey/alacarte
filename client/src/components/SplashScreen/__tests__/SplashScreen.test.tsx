import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SplashScreen from '../SplashScreen'
import React from 'react'

// Mock CSS modules
vi.mock('../SplashScreen.module.css', () => ({
  default: {
    splashScreen: 'splashScreen',
    fadeOut: 'fadeOut',
    content: 'content',
    logo: 'logo',
  },
}))

describe('SplashScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('renders the logo text', () => {
    render(<SplashScreen />)
    expect(screen.getByText('Alacarte')).toBeDefined()
  })

  it('applies fadeOut class when fadeOut prop is true', () => {
    const { container } = render(<SplashScreen fadeOut={true} />)
    const splash = container.firstChild as HTMLElement
    expect(splash.className).toContain('fadeOut')
  })

  it('calls onAnimationEnd after transition delay', () => {
    const onAnimationEnd = vi.fn()
    render(<SplashScreen fadeOut={true} onAnimationEnd={onAnimationEnd} />)
    
    act(() => {
      vi.advanceTimersByTime(500)
    })
    
    expect(onAnimationEnd).toHaveBeenCalled()
  })
})
