"use client"

import { useMemo, useState } from "react"
import { PageContent } from "@/components/dashboard/app-shell"
import { PageHeader } from "@/components/dashboard/page-header"
import { ReportToolbar, type Range } from "@/components/dashboard/report-toolbar"
import { LedgerCard, type LedgerRow } from "@/components/transactions/ledger-card"
import { LedgerFilters, NO_FILTERS, type LedgerFilterState } from "@/components/transactions/ledger-filters"
import { LedgerSummary } from "@/components/transactions/ledger-summary"
import { ACCOUNT_ACTIVITY, ACCOUNTS, DEFAULT_RANGE, TRANSACTIONS } from "@/lib/data"
import { parseIsoDate } from "@/lib/format"

const accountName = new Map(ACCOUNTS.map((a) => [a.id, a.name]))

/** All money movement: spending and income plus transfers, interest and contributions. */
const LEDGER: LedgerRow[] = [...TRANSACTIONS, ...ACCOUNT_ACTIVITY]
  .sort((a, b) => b.date.localeCompare(a.date))
  .map((t) => ({ ...t, accountName: accountName.get(t.account) ?? t.account }))

const ACCOUNT_OPTIONS = ACCOUNTS.map((a) => ({ value: a.id, label: a.name }))

const CATEGORY_OPTIONS = [...new Set(LEDGER.map((t) => t.category))]
  .sort((a, b) => a.localeCompare(b))
  .map((c) => ({ value: c, label: c }))

function matches(t: LedgerRow, filters: LedgerFilterState) {
  if (filters.type === "income" && t.amount <= 0) return false
  if (filters.type === "spending" && t.amount >= 0) return false
  if (filters.account !== "all" && t.account !== filters.account) return false
  return filters.category === "all" || t.category === filters.category
}

/** Transactions — the full ledger across every account. */
export function TransactionsView() {
  const [query, setQuery] = useState("")
  const [range, setRange] = useState<Range>(DEFAULT_RANGE)
  const [filters, setFilters] = useState<LedgerFilterState>(NO_FILTERS)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const from = new Date(range.from).setHours(0, 0, 0, 0)
    const to = new Date(range.to).setHours(23, 59, 59, 999)
    return LEDGER.filter((t) => {
      const d = parseIsoDate(t.date).getTime()
      if (d < from || d > to || !matches(t, filters)) return false
      if (!q) return true
      return [t.name, t.category, t.method, t.accountName].some((v) => v.toLowerCase().includes(q))
    })
  }, [query, range, filters])

  const clearAll = () => {
    setQuery("")
    setFilters(NO_FILTERS)
  }

  return (
    <>
      <PageHeader
        title="Transactions"
        subtitle="Every dollar in and out, across all accounts."
        query={query}
        onQueryChange={setQuery}
      />
      <PageContent>
        <ReportToolbar range={range} onRangeChange={setRange} rows={filtered} />
        <LedgerFilters
          filters={filters}
          onChange={setFilters}
          accounts={ACCOUNT_OPTIONS}
          categories={CATEGORY_OPTIONS}
        />
        <LedgerSummary rows={filtered} />
        <LedgerCard rows={filtered} onClear={clearAll} />
      </PageContent>
    </>
  )
}
