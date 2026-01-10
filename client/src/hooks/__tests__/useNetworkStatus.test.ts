import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNetworkStatus } from '../useNetworkStatus';

describe('useNetworkStatus Hook', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', {
      ...navigator,
      onLine: true,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should return true when online', () => {
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current).toBe(true);
  });

  it('should update status when going offline', () => {
    const { result } = renderHook(() => useNetworkStatus());

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current).toBe(false);
  });

  it('should update status when going online', () => {
    vi.stubGlobal('navigator', {
      ...navigator,
      onLine: false,
    });

    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current).toBe(false);

    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    expect(result.current).toBe(true);
  });
});
