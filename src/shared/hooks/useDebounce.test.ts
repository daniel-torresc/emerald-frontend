import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    )

    expect(result.current).toBe('initial')

    // Update the value
    rerender({ value: 'updated', delay: 500 })

    // Value should not change immediately
    expect(result.current).toBe('initial')

    // Fast-forward time by 499ms (just before delay)
    act(() => {
      vi.advanceTimersByTime(499)
    })
    expect(result.current).toBe('initial')

    // Fast-forward the remaining 1ms
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('updated')
  })

  it('should reset the timer on rapid value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: 'initial' },
      }
    )

    // First update
    rerender({ value: 'first' })
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('initial')

    // Second update before delay expires
    rerender({ value: 'second' })
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('initial')

    // Third update before delay expires
    rerender({ value: 'third' })
    act(() => {
      vi.advanceTimersByTime(499)
    })
    expect(result.current).toBe('initial')

    // Finally let the timer expire
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('third')
  })

  it('should handle custom delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 1000 },
      }
    )

    rerender({ value: 'updated', delay: 1000 })

    act(() => {
      vi.advanceTimersByTime(999)
    })
    expect(result.current).toBe('initial')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('updated')
  })

  it('should use default delay of 500ms when not specified', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      {
        initialProps: { value: 'initial' },
      }
    )

    rerender({ value: 'updated' })

    act(() => {
      vi.advanceTimersByTime(499)
    })
    expect(result.current).toBe('initial')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('updated')
  })

  it('should handle different data types', () => {
    // Test with numbers
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      {
        initialProps: { value: 0 },
      }
    )

    numberRerender({ value: 42 })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(numberResult.current).toBe(42)

    // Test with booleans
    const { result: boolResult, rerender: boolRerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      {
        initialProps: { value: false },
      }
    )

    boolRerender({ value: true })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(boolResult.current).toBe(true)

    // Test with objects
    const { result: objectResult, rerender: objectRerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      {
        initialProps: { value: { id: 1 } },
      }
    )

    const newObj = { id: 2 }
    objectRerender({ value: newObj })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(objectResult.current).toEqual(newObj)
  })

  it('should cleanup timeout on unmount', () => {
    const { rerender, unmount } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: 'initial' },
      }
    )

    rerender({ value: 'updated' })

    // Unmount before delay expires
    unmount()

    // Advance timers - should not cause any issues
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // No assertion needed - if cleanup works, no error will be thrown
  })

  it('should handle delay changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    )

    rerender({ value: 'updated', delay: 500 })

    // Change delay mid-debounce
    act(() => {
      vi.advanceTimersByTime(200)
    })
    rerender({ value: 'updated', delay: 1000 })

    // Original delay should be cancelled, new delay should be used
    act(() => {
      vi.advanceTimersByTime(800)
    })
    expect(result.current).toBe('initial')

    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('updated')
  })

  it('should handle empty strings', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      {
        initialProps: { value: 'something' },
      }
    )

    rerender({ value: '' })

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current).toBe('')
  })

  it('should handle null and undefined values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      {
        initialProps: { value: 'initial' as string | null | undefined },
      }
    )

    rerender({ value: null })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current).toBe(null)

    rerender({ value: undefined })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current).toBe(undefined)
  })
})
