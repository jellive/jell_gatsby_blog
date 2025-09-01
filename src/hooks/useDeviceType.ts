'use client'

import { useState, useEffect, useCallback } from 'react'

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

export interface DeviceInfo {
  type: DeviceType
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  width: number
  height: number
  orientation: 'portrait' | 'landscape'
  touchEnabled: boolean
  pixelRatio: number
}

export interface UseDeviceTypeOptions {
  /**
   * Debounce delay for resize events (milliseconds)
   * @default 150
   */
  debounceDelay?: number

  /**
   * Mobile breakpoint (inclusive)
   * @default 768
   */
  mobileBreakpoint?: number

  /**
   * Tablet breakpoint (inclusive)
   * @default 1024
   */
  tabletBreakpoint?: number

  /**
   * Enable SSR-safe mode (prevents hydration mismatches)
   * @default true
   */
  ssrSafe?: boolean
}

const DEFAULT_OPTIONS: Required<UseDeviceTypeOptions> = {
  debounceDelay: 150,
  mobileBreakpoint: 768,
  tabletBreakpoint: 1024,
  ssrSafe: true,
}

/**
 * Custom hook for detecting device type and characteristics
 *
 * Features:
 * - Responsive breakpoint detection
 * - Touch capability detection
 * - Orientation tracking
 * - Performance optimized with debouncing
 * - SSR-safe with hydration mismatch prevention
 * - Korean mobile optimization aware
 *
 * @param options Configuration options
 * @returns Device information and utilities
 */
export const useDeviceType = (
  options: UseDeviceTypeOptions = {}
): DeviceInfo => {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  // SSR-safe initial state
  const getInitialState = useCallback((): DeviceInfo => {
    // Server-side safe defaults
    if (typeof window === 'undefined') {
      return {
        type: 'desktop',
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        width: 1024,
        height: 768,
        orientation: 'landscape',
        touchEnabled: false,
        pixelRatio: 1,
      }
    }

    // Client-side detection
    const width = window.innerWidth
    const height = window.innerHeight
    const pixelRatio = window.devicePixelRatio || 1
    const touchEnabled =
      'ontouchstart' in window || navigator.maxTouchPoints > 0
    const orientation = width > height ? 'landscape' : 'portrait'

    let type: DeviceType
    if (width < opts.mobileBreakpoint) {
      type = 'mobile'
    } else if (width < opts.tabletBreakpoint) {
      type = 'tablet'
    } else {
      type = 'desktop'
    }

    return {
      type,
      isMobile: type === 'mobile',
      isTablet: type === 'tablet',
      isDesktop: type === 'desktop',
      width,
      height,
      orientation,
      touchEnabled,
      pixelRatio,
    }
  }, [opts.mobileBreakpoint, opts.tabletBreakpoint])

  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(getInitialState)
  const [mounted, setMounted] = useState(false)

  // Handle window resize with debouncing
  useEffect(() => {
    setMounted(true)

    // Update device info immediately on mount for client-side hydration
    setDeviceInfo(getInitialState())

    let timeoutId: NodeJS.Timeout

    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setDeviceInfo(getInitialState())
      }, opts.debounceDelay)
    }

    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('orientationchange', handleResize, {
      passive: true,
    })

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [getInitialState, opts.debounceDelay])

  // Return SSR-safe values
  if (opts.ssrSafe && !mounted) {
    return getInitialState()
  }

  return deviceInfo
}

/**
 * Utility hook for conditional mobile rendering
 * Helps prevent unnecessary renders on mobile devices
 */
export const useMobileOptimization = (options: UseDeviceTypeOptions = {}) => {
  const device = useDeviceType(options)

  /**
   * Conditionally render content based on device type
   * @param content Content to render
   * @param condition Condition function or boolean
   */
  const renderIf = useCallback(
    <T>(
      content: T,
      condition: boolean | ((device: DeviceInfo) => boolean)
    ): T | null => {
      const shouldRender =
        typeof condition === 'function' ? condition(device) : condition
      return shouldRender ? content : null
    },
    [device]
  )

  /**
   * Render content only on mobile devices
   */
  const mobileOnly = useCallback(
    <T>(content: T): T | null => renderIf(content, device.isMobile),
    [renderIf, device.isMobile]
  )

  /**
   * Render content only on tablet devices
   */
  const tabletOnly = useCallback(
    <T>(content: T): T | null => renderIf(content, device.isTablet),
    [renderIf, device.isTablet]
  )

  /**
   * Render content only on desktop devices
   */
  const desktopOnly = useCallback(
    <T>(content: T): T | null => renderIf(content, device.isDesktop),
    [renderIf, device.isDesktop]
  )

  /**
   * Render content only on touch-enabled devices
   */
  const touchOnly = useCallback(
    <T>(content: T): T | null => renderIf(content, device.touchEnabled),
    [renderIf, device.touchEnabled]
  )

  return {
    ...device,
    renderIf,
    mobileOnly,
    tabletOnly,
    desktopOnly,
    touchOnly,
  }
}

/**
 * Performance hook for mobile-optimized component rendering
 * Reduces unnecessary re-renders and computations on mobile
 */
export const useMobilePerformance = () => {
  const device = useDeviceType()

  /**
   * Returns a value based on device type performance characteristics
   * Mobile gets the most optimized/simplified version
   */
  const getByDevice = useCallback(
    <T>(values: { mobile: T; tablet?: T; desktop?: T }): T => {
      switch (device.type) {
        case 'mobile':
          return values.mobile
        case 'tablet':
          return values.tablet ?? values.mobile
        case 'desktop':
          return values.desktop ?? values.tablet ?? values.mobile
        default:
          return values.mobile
      }
    },
    [device.type]
  )

  /**
   * Performance-aware component props based on device
   */
  const getOptimizedProps = useCallback(() => {
    return {
      // Animation settings
      reducedMotion: device.isMobile,
      animationDuration: device.isMobile ? 200 : 300,

      // Touch settings
      touchAction: device.touchEnabled ? 'manipulation' : 'auto',

      // Loading strategies
      lazy: device.isMobile ? 'eager' : 'lazy',

      // Quality settings for images/videos
      quality: getByDevice({
        mobile: 'medium',
        tablet: 'high',
        desktop: 'high',
      }),
    }
  }, [device.isMobile, device.touchEnabled, getByDevice])

  return {
    device,
    getByDevice,
    getOptimizedProps,
  }
}

export default useDeviceType
