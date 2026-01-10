import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import Offline from '../Offline';

describe('Offline Page', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the offline message', () => {
    render(<Offline />);
    expect(screen.getByText('No Internet Connection')).toBeInTheDocument();
    expect(screen.getByText(/It seems you are offline/)).toBeInTheDocument();
  });

  it('renders the retry button', () => {
    render(<Offline />);
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('reloads the page when retry button is clicked', () => {
    const { location } = window;
    // @ts-expect-error - overriding window.location for testing
    delete window.location;
    window.location = { ...location, reload: vi.fn() };

    render(<Offline />);
    const retryButton = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryButton);

    expect(window.location.reload).toHaveBeenCalled();

    window.location = location;
  });
});
