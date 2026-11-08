"use client"

import { useMemo, useState } from "react"
import { ANALYTICS_STATS } from "@/components/analytics/analytics-stats"
import { CategoryCard } from "@/components/analytics/category-card"
import { InsightsCard } from "@/components/analytics/insights-card"
import { MerchantsCard } from "@/components/analytics/merchants-card"
import { MonthlyCard } from "@/components/analytics/monthly-card"
import { StatCards } from "@/components/dashboard/stat-cards"
import { WeekdayCard } from "@/components/analytics/weekday-card"
import { PageContent } from "@/components/dashboard/app-shell"
import { PageHeader } from "@/components/dashboard/page-header"
import { TOP_MERCHANTS } from "@/lib/data/analytics"

const PREVIEW_ROWS = 8

const MERCHANTS = [...TOP_MERCHANTS].sort((a, b) => b.total - a.total)

/** Analytics — where the year's spending went: when, on what, and where. */
export function AnalyticsView() {
  const [query, setQuery] = useState("")
  const [expanded, setExpanded] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return MERCHANTS
    return MERCHANTS.filter((m) => [m.merchant, m.category].some((v) => v.toLowerCase().includes(q)))
  }, [query])

  const visible = expanded || query ? filtered : filtered.slice(0, PREVIEW_ROWS)

  return (
    <>
      <PageHeader
        searchLabel="Search merchants"
        title="Analytics"
        subtitle="Where your spending went, Jan – Sep 2026."
        query={query}
        onQueryChange={setQuery}
      />
      <PageContent>
        <StatCards items={ANALYTICS_STATS} label="Spending summary" />
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
            <MonthlyCard />
            <WeekdayCard />
            <InsightsCard className="flex-1" />
          </div>
          <CategoryCard />
        </div>
        <MerchantsCard
          rows={visible}
          expanded={expanded}
          onToggleExpanded={() => setExpanded((v) => !v)}
          query={query}
          hiddenCount={Math.max(0, filtered.length - PREVIEW_ROWS)}
        />
      </PageContent>
    </>
  )
}
