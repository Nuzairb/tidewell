"use client"

import { createContext, use, useCallback, useEffect, useState, type ReactNode } from "react"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { BREAKPOINTS, useMediaQuery } from "@/lib/use-media-query"
import { cn } from "@/lib/utils"

const ShellContext = createContext<{ openMenu: () => void }>({ openMenu: () => {} })

/** Lets a page header open the sidebar drawer (< lg). */
export const useShell = () => use(ShellContext)

/**
 * Figma node 1:3 — sidebar + main column, shared by every screen so the rail's
 * collapsed state survives navigation.
 *
 * ≥1024px (lg): sidebar is a docked rail that can collapse to 62px.
 * <1024px:      sidebar becomes an off-canvas drawer opened from the header.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const isDesktop = useMediaQuery(BREAKPOINTS.lg)
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [instant, setInstant] = useState(false)

  const mobileOpen = drawerOpen && !isDesktop

  const toggleSidebar = useCallback(
    (fromKeyboard = false) => {
      setInstant(fromKeyboard)
      if (isDesktop) setCollapsed((c) => !c)
      else setDrawerOpen((o) => !o)
    },
    [isDesktop]
  )

  const closeDrawer = useCallback(() => {
    setInstant(false)
    setDrawerOpen(false)
  }, [])

  // ⌘B / Ctrl+B — keyboard toggles are instant (never animate keyboard actions)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault()
        toggleSidebar(true)
      }
      if (e.key === "Escape" && mobileOpen) setDrawerOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [toggleSidebar, mobileOpen])

  return (
    <ShellContext value={{ openMenu: () => toggleSidebar(false) }}>
      <div className="flex h-dvh w-full overflow-hidden bg-app">
        <AppSidebar
          collapsed={collapsed && isDesktop}
          instant={instant}
          isDesktop={isDesktop}
          mobileOpen={mobileOpen}
          onToggle={() => toggleSidebar(false)}
          onCloseMobile={closeDrawer}
        />

        {/* Drawer scrim (mobile / tablet only) */}
        <div
          aria-hidden
          onClick={() => setDrawerOpen(false)}
          className={cn(
            "fixed inset-0 z-40 bg-(--bg-overlay) transition-opacity duration-(--duration-slow) ease-out-strong lg:hidden",
            mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
            instant && "transition-none"
          )}
        />

        <main
          inert={mobileOpen}
          className="relative flex min-w-0 flex-1 flex-col overflow-hidden lg:after:pointer-events-none lg:after:absolute lg:after:inset-y-0 lg:after:right-0 lg:after:z-20 lg:after:w-px lg:after:bg-line-subtle"
        >
          {children}
        </main>
      </div>
    </ShellContext>
  )
}

/**
 * Scrolling content column under the page header.
 * scrollbar-gutter: stable reserves the scrollbar's space up front, so content
 * growing (e.g. "View all") never shifts the layout sideways.
 */
export function PageContent({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-gutter:stable] [scrollbar-width:thin]">
      <div className="flex flex-col gap-3 p-4 sm:gap-4 md:p-6">{children}</div>
    </div>
  )
}
