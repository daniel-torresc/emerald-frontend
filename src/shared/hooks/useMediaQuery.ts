import { useEffect, useState } from 'react'

/**
 * Hook to detect if a media query matches the current viewport.
 * Useful for responsive design and conditional rendering based on screen size.
 *
 * @param query - The media query string (e.g., "(min-width: 768px)")
 * @returns Boolean indicating if the media query currently matches
 *
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 767px)')
 * const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
 * const isDesktop = useMediaQuery('(min-width: 1024px)')
 *
 * return (
 *   <div>
 *     {isMobile && <MobileNav />}
 *     {isDesktop && <DesktopNav />}
 *   </div>
 * )
 * ```
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with the current match state
  const [matches, setMatches] = useState<boolean>(() => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') {
      return false
    }
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    // Return early if window is not available (SSR)
    if (typeof window === 'undefined') {
      return
    }

    const mediaQueryList = window.matchMedia(query)

    // Update state when media query match changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Set initial state
    setMatches(mediaQueryList.matches)

    // Add listener
    // Using addEventListener for modern browsers
    mediaQueryList.addEventListener('change', handleChange)

    // Cleanup
    return () => {
      mediaQueryList.removeEventListener('change', handleChange)
    }
  }, [query])

  return matches
}

/**
 * Predefined breakpoint hooks for common responsive scenarios.
 * Based on the Emerald design system breakpoints:
 * - Mobile: 320-767px
 * - Tablet: 768-1023px
 * - Desktop: 1024px+
 */

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)')
}

export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)')
}

export function useIsTabletOrAbove(): boolean {
  return useMediaQuery('(min-width: 768px)')
}

export function useIsMobileOrTablet(): boolean {
  return useMediaQuery('(max-width: 1023px)')
}
