"use client"

import { useMemo, useState } from "react"
import { PageContent } from "@/components/dashboard/app-shell"
import { PageHeader } from "@/components/dashboard/page-header"
import { ReportToolbar, type Range } from "@/components/dashboard/report-toolbar"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { CashFlowCard } from "@/components/dashboard/cash-flow-card"
import { TransactionsCard } from "@/components/dashboard/transactions-card"
import { DEFAULT_RANGE, TRANSACTIONS } from "@/lib/data"
import { parseIsoDate } from "@/lib/format"

const PREVIEW_ROWS = 5

/** Figma node 1:3 — the Reports screen (content column only; the shell is shared). */
export function ReportsView() {
  const [query, setQuery] = useState("")
  const [range, setRange] = useState<Range>(DEFAULT_RANGE)
  const [expanded, setExpanded] = useState(false)

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
    <>
      <PageHeader
        title="Reports"
        subtitle="Track your finances and spending habits."
        query={query}
        onQueryChange={setQuery}
      />
      <PageContent>
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
      </PageContent>
    </>
  )
}
