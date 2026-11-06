"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { PageHeader } from "@/components/dashboard/page-header"
import { ReportToolbar, type Range } from "@/components/dashboard/report-toolbar"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { CashFlowCard } from "@/components/dashboard/cash-flow-card"
import { TransactionsCard } from "@/components/dashboard/transactions-card"
import { DEFAULT_RANGE, TRANSACTIONS } from "@/lib/data"
import { parseIsoDate } from "@/lib/format"
import { BREAKPOINTS, useMediaQuery } from "@/lib/use-media-query"
import { cn } from "@/lib/utils"

const PREVIEW_ROWS = 5

/**
 * Figma node 1:3 — "Finance Dashboard — Redesign", 1440×1024.
 *
 * ≥1024px (lg): sidebar is a docked rail that can collapse to 62px.
 * <1024px:      sidebar becomes an off-canvas drawer opened from the header.
 */
export function Dashboard() {
  const isDesktop = useMediaQuery(BREAKPOINTS.lg)
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [instant, setInstant] = useState(false)
  const [query, setQuery] = useState("")
  const [range, setRange] = useState<Range>(DEFAULT_RANGE)
  const [expanded, setExpanded] = useState(false)

  const mobileOpen = drawerOpen && !isDesktop

  const toggleSidebar = useCallback(
    (fromKeyboard = false) => {
      setInstant(fromKeyboard)
      if (isDesktop) setCollapsed((c) => !c)
      else setDrawerOpen((o) => !o)
    },
    [isDesktop]
  )

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const from = new Date(range.from).setHours(0, 0, 0, 0)
    const to = new Date(range.to).setHours(23, 59, 59, 999)
    return TRANSACTIONS.filter((t) => {
      const d = parseIsoDate(t.date).getTime()
      if (d < from || d > to) return false
      if (!q) return true
      return [t.name, t.category, t.method].some((v) => v.toLowerCase().includes(q))
    })
  }, [query, range])

  const visible = expanded || query ? filtered : filtered.slice(0, PREVIEW_ROWS)

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-app">
      <AppSidebar
        collapsed={collapsed && isDesktop}
        instant={instant}
        isDesktop={isDesktop}
        mobileOpen={mobileOpen}
        onToggle={() => toggleSidebar(false)}
        onCloseMobile={() => {
          setInstant(false)
          setDrawerOpen(false)
        }}
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
        <PageHeader query={query} onQueryChange={setQuery} onOpenMenu={() => toggleSidebar(false)} />
        {/*
          scrollbar-gutter: stable reserves the scrollbar's space up front, so
          "View all" growing the page never shifts the layout sideways.
        */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-gutter:stable] [scrollbar-width:thin]">
          <div className="flex flex-col gap-3 p-4 sm:gap-4 md:p-6">
            <ReportToolbar range={range} onRangeChange={setRange} rows={filtered} />
            <KpiCards />
            <CashFlowCard />
            <TransactionsCard
              rows={visible}
              expanded={expanded}
              onToggleExpanded={() => setExpanded((v) => !v)}
              query={query}
              hiddenCount={Math.max(0, filtered.length - PREVIEW_ROWS)}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
