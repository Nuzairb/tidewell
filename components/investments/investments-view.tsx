"use client"

import { useMemo, useState } from "react"
import { PageContent } from "@/components/dashboard/app-shell"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { PageHeader } from "@/components/dashboard/page-header"
import { TransactionsCard } from "@/components/dashboard/transactions-card"
import { AllocationCard } from "@/components/investments/allocation-card"
import { HoldingsCard } from "@/components/investments/holdings-card"
import { ACCOUNT, HOLDING_ROWS, PORTFOLIO, formatPct } from "@/components/investments/portfolio"
import { PortfolioValueCard } from "@/components/investments/portfolio-value-card"
import { ACCOUNT_ACTIVITY, type Kpi } from "@/lib/data"
import { MONTHLY_CONTRIBUTION } from "@/lib/data/investments"
import { formatBalance, formatSignedUsd, parseIsoDate } from "@/lib/format"

const PREVIEW_ROWS = 5

const ACTIVITY = ACCOUNT_ACTIVITY.filter((t) => t.account === ACCOUNT.id).sort((a, b) =>
  b.date.localeCompare(a.date)
)

const lastDividend = ACTIVITY.find((t) => t.category === "Dividend")!
const monthLong = new Intl.DateTimeFormat("en-US", { month: "long" })

const KPIS: Kpi[] = [
  {
    id: "value",
    label: "Portfolio value",
    value: formatBalance(PORTFOLIO.value),
    change: formatSignedUsd(ACCOUNT.monthChange),
    context: "this month",
    trend: ACCOUNT.monthChange >= 0 ? "up" : "down",
    sentiment: ACCOUNT.monthChange >= 0 ? "positive" : "negative",
    icon: "wallet-02",
    action: "Accounts",
    href: "/accounts",
  },
  {
    id: "gain",
    label: "Gain this year",
    value: formatSignedUsd(PORTFOLIO.gain),
    change: formatPct(PORTFOLIO.returnPct),
    context: "return since Jan 1",
    trend: PORTFOLIO.gain >= 0 ? "up" : "down",
    sentiment: PORTFOLIO.gain >= 0 ? "positive" : "negative",
    icon: "line-chart-up-05",
    action: "Performance",
  },
  {
    id: "dividends",
    label: "Dividends this year",
    value: formatBalance(PORTFOLIO.dividends),
    change: formatSignedUsd(lastDividend.amount),
    context: `in ${monthLong.format(parseIsoDate(lastDividend.date))}`,
    trend: "up",
    sentiment: "positive",
    icon: "coins-swap-01",
    action: "Dividends",
  },
  {
    id: "contributions",
    label: "Contributions this year",
    value: formatBalance(PORTFOLIO.contributions),
    change: formatSignedUsd(MONTHLY_CONTRIBUTION),
    context: "every month",
    trend: "up",
    sentiment: "positive",
    icon: "credit-card-down",
    action: "Contributions",
  },
]

const matches = (values: string[], q: string) => values.some((v) => v.toLowerCase().includes(q))

/** Investments — the Vanguard Index Portfolio: value, mix, funds and what moved in. */
export function InvestmentsView() {
  const [query, setQuery] = useState("")
  const [expanded, setExpanded] = useState(false)
  const q = query.trim().toLowerCase()

  const holdings = useMemo(
    () => (q ? HOLDING_ROWS.filter((h) => matches([h.ticker, h.name, h.assetClass], q)) : HOLDING_ROWS),
    [q]
  )
  // the activity card reports its own match count, so it has to be filtered by the same query
  const activity = useMemo(
    () => (q ? ACTIVITY.filter((t) => matches([t.name, t.category, t.method], q)) : ACTIVITY),
    [q]
  )

  const visible = expanded || query ? activity : activity.slice(0, PREVIEW_ROWS)

  return (
    <>
      <PageHeader
        searchLabel="Search holdings and activity"
        title="Investments"
        subtitle={`${ACCOUNT.institution} ${ACCOUNT.name}, and how it's growing.`}
        query={query}
        onQueryChange={setQuery}
      />
      <PageContent>
        <KpiCards items={KPIS} label="Investments summary" />
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <PortfolioValueCard />
          <AllocationCard />
        </div>
        <HoldingsCard rows={holdings} query={query} />
        <TransactionsCard
          title="Portfolio activity"
          rows={visible}
          expanded={expanded}
          onToggleExpanded={() => setExpanded((v) => !v)}
          query={query}
          hiddenCount={Math.max(0, activity.length - PREVIEW_ROWS)}
        />
      </PageContent>
    </>
  )
}
