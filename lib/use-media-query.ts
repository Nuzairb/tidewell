"use client"

import { useSyncExternalStore } from "react"

/** Breakpoints — keep in sync with DESIGN_SYSTEM.md §5.2 (Tailwind defaults). */
export const BREAKPOINTS = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
} as const

/**
 * SSR-safe media query. The server (and the hydration pass) render the
 * `serverFallback` value; the client then switches without a mismatch warning.
 * Prefer CSS breakpoints for layout — use this only where behaviour differs.
 */
export function useMediaQuery(query: string, serverFallback = true) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    },
    () => window.matchMedia(query).matches,
    () => serverFallback
  )
}
