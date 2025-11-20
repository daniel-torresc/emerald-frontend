import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsTabletOrAbove,
  useIsMobileOrTablet,
} from './useMediaQuery'

describe('useMediaQuery', () => {
  // Helper to mock matchMedia with a specific match state
  const mockMatchMedia = (matches: boolean) => {
    const listeners: Array<(event: MediaQueryListEvent) => void> = []

    const mockMediaQueryList = {
      matches,
      media: '',
      onchange: null,
      addListener: vi.fn(), // Deprecated but still supported
      removeListener: vi.fn(), // Deprecated but still supported
      addEventListener: vi.fn((event: string, handler: (event: MediaQueryListEvent) => void) => {
        if (event === 'change') {
          listeners.push(handler)
        }
      }),
      removeEventListener: vi.fn((event: string, handler: (event: MediaQueryListEvent) => void) => {
        if (event === 'change') {
          const index = listeners.indexOf(handler)
          if (index > -1) {
            listeners.splice(index, 1)
          }
        }
      }),
      dispatchEvent: vi.fn(),
      // Helper to trigger change event
      _triggerChange: (newMatches: boolean) => {
        mockMediaQueryList.matches = newMatches
        listeners.forEach((listener) => {
          listener({ matches: newMatches } as MediaQueryListEvent)
        })
      },
    }

    window.matchMedia = vi.fn(() => mockMediaQueryList as unknown as MediaQueryList)

    return mockMediaQueryList
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return true when media query matches', () => {
    mockMatchMedia(true)

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))

    expect(result.current).toBe(true)
  })

  it('should return false when media query does not match', () => {
    mockMatchMedia(false)

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))

    expect(result.current).toBe(false)
  })

  it('should update when media query match changes', () => {
    const mockMQL = mockMatchMedia(false)

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))

    expect(result.current).toBe(false)

    // Simulate viewport resize that changes the match
    act(() => {
      mockMQL._triggerChange(true)
    })

    expect(result.current).toBe(true)

    // Change back
    act(() => {
      mockMQL._triggerChange(false)
    })

    expect(result.current).toBe(false)
  })

  it('should add event listener on mount', () => {
    const mockMQL = mockMatchMedia(false)

    renderHook(() => useMediaQuery('(min-width: 768px)'))

    expect(mockMQL.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('should remove event listener on unmount', () => {
    const mockMQL = mockMatchMedia(false)

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'))

    unmount()

    expect(mockMQL.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('should update listeners when query changes', () => {
    const mockMQL = mockMatchMedia(false)

    const { rerender } = renderHook(({ query }) => useMediaQuery(query), {
      initialProps: { query: '(min-width: 768px)' },
    })

    expect(mockMQL.addEventListener).toHaveBeenCalledTimes(1)

    rerender({ query: '(min-width: 1024px)' })

    // Should remove old listener and add new one
    expect(mockMQL.removeEventListener).toHaveBeenCalledTimes(1)
    expect(mockMQL.addEventListener).toHaveBeenCalledTimes(2)
  })

  it('should handle SSR gracefully (no window)', () => {
    const originalWindow = global.window
    // @ts-expect-error - Testing SSR scenario
    delete global.window

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))

    expect(result.current).toBe(false)

    global.window = originalWindow
  })

  describe('Predefined breakpoint hooks', () => {
    it('useIsMobile should detect mobile viewport', () => {
      mockMatchMedia(true)

      const { result } = renderHook(() => useIsMobile())

      expect(result.current).toBe(true)
      expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 767px)')
    })

    it('useIsTablet should detect tablet viewport', () => {
      mockMatchMedia(true)

      const { result } = renderHook(() => useIsTablet())

      expect(result.current).toBe(true)
      expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 768px) and (max-width: 1023px)')
    })

    it('useIsDesktop should detect desktop viewport', () => {
      mockMatchMedia(true)

      const { result } = renderHook(() => useIsDesktop())

      expect(result.current).toBe(true)
      expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 1024px)')
    })

    it('useIsTabletOrAbove should detect tablet and desktop viewports', () => {
      mockMatchMedia(true)

      const { result } = renderHook(() => useIsTabletOrAbove())

      expect(result.current).toBe(true)
      expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 768px)')
    })

    it('useIsMobileOrTablet should detect mobile and tablet viewports', () => {
      mockMatchMedia(true)

      const { result } = renderHook(() => useIsMobileOrTablet())

      expect(result.current).toBe(true)
      expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 1023px)')
    })
  })

  describe('Breakpoint integration scenarios', () => {
    it('should correctly identify mobile viewport (400px)', () => {
      mockMatchMedia(true)
      const mobile = renderHook(() => useIsMobile())
      expect(mobile.result.current).toBe(true)

      mockMatchMedia(false)
      const tablet = renderHook(() => useIsTablet())
      expect(tablet.result.current).toBe(false)

      mockMatchMedia(false)
      const desktop = renderHook(() => useIsDesktop())
      expect(desktop.result.current).toBe(false)
    })

    it('should correctly identify tablet viewport (800px)', () => {
      mockMatchMedia(false)
      const mobile = renderHook(() => useIsMobile())
      expect(mobile.result.current).toBe(false)

      mockMatchMedia(true)
      const tablet = renderHook(() => useIsTablet())
      expect(tablet.result.current).toBe(true)

      mockMatchMedia(false)
      const desktop = renderHook(() => useIsDesktop())
      expect(desktop.result.current).toBe(false)
    })

    it('should correctly identify desktop viewport (1200px)', () => {
      mockMatchMedia(false)
      const mobile = renderHook(() => useIsMobile())
      expect(mobile.result.current).toBe(false)

      mockMatchMedia(false)
      const tablet = renderHook(() => useIsTablet())
      expect(tablet.result.current).toBe(false)

      mockMatchMedia(true)
      const desktop = renderHook(() => useIsDesktop())
      expect(desktop.result.current).toBe(true)
    })
  })

  it('should handle multiple simultaneous hooks', () => {
    mockMatchMedia(true)

    const { result: result1 } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    const { result: result2 } = renderHook(() => useMediaQuery('(max-width: 1023px)'))

    expect(result1.current).toBe(true)
    expect(result2.current).toBe(true)
  })

  it('should not cause memory leaks with rapid mount/unmount', () => {
    const mockMQL = mockMatchMedia(false)

    // Mount and unmount multiple times
    for (let i = 0; i < 10; i++) {
      const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'))
      unmount()
    }

    // Should have equal calls to add and remove
    expect(mockMQL.addEventListener).toHaveBeenCalledTimes(10)
    expect(mockMQL.removeEventListener).toHaveBeenCalledTimes(10)
  })
})
