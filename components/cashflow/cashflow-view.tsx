"use client"

import { useState } from "react"
import { BreakdownCard } from "@/components/cashflow/breakdown-card"
import { MonthlyTable } from "@/components/cashflow/monthly-table"
import { PageContent } from "@/components/dashboard/app-shell"
import { CardAction } from "@/components/dashboard/card-action"
import { CashFlowCard } from "@/components/dashboard/cash-flow-card"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { PageHeader } from "@/components/dashboard/page-header"
import type { Kpi } from "@/lib/data"
import {
  CASHFLOW_TOTALS,
  INCOME_SOURCES,
  MONTHLY_CASHFLOW,
  SPENDING_CATEGORIES,
  periodShares,
  type CashflowMonth,
} from "@/lib/data/cashflow"
import { formatUsd } from "@/lib/format"

const SOURCES = periodShares(INCOME_SOURCES)
const CATEGORIES = periodShares(SPENDING_CATEGORIES)

const average = (months: CashflowMonth[], key: "income" | "expenses" | "net") =>
  months.reduce((sum, m) => sum + m[key], 0) / months.length

/** Q3 against the first half, as "+1.2%" / "−0.4%" with the true minus sign. */
function quarterChange(key: "income" | "expenses" | "net") {
  const change = average(MONTHLY_CASHFLOW.slice(6), key) / average(MONTHLY_CASHFLOW.slice(0, 6), key) - 1
  const up = change >= 0
  return { change: `${up ? "+" : "−"}${Math.abs(change * 100).toFixed(1)}%`, up }
}

function cashflowKpis(): Kpi[] {
  const income = quarterChange("income")
  const spend = quarterChange("expenses")
  const net = quarterChange("net")
  const best = MONTHLY_CASHFLOW.reduce((a, b) => (b.net > a.net ? b : a))
  const bestIndex = MONTHLY_CASHFLOW.indexOf(best)
  const bestName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(2026, bestIndex, 1))

  return [
    {
      id: "avg-income",
      label: "Avg. monthly income",
      value: formatUsd(average(MONTHLY_CASHFLOW, "income")),
      change: income.change,
      context: "Q3 vs H1",
      trend: income.up ? "up" : "down",
      sentiment: income.up ? "positive" : "negative",
      icon: "credit-card-down",
      action: "Income",
      href: "/transactions",
    },
    {
      id: "avg-spend",
      label: "Avg. monthly spend",
      value: formatUsd(average(MONTHLY_CASHFLOW, "expenses")),
      change: spend.change,
      context: "Q3 vs H1",
      trend: spend.up ? "up" : "down",
      // spending less is the good direction
      sentiment: spend.up ? "negative" : "positive",
      icon: "minus-circle",
      action: "Expenses",
      href: "/transactions",
    },
    {
      id: "avg-net",
      label: "Avg. monthly net",
      value: formatUsd(average(MONTHLY_CASHFLOW, "net")),
      change: net.change,
      context: "Q3 vs H1",
      trend: net.up ? "up" : "down",
      sentiment: net.up ? "positive" : "negative",
      icon: "line-chart-up-05",
      action: "Reports",
      href: "/reports",
    },
    {
      id: "best-month",
      label: "Best month",
      value: formatUsd(best.net),
      change: `${Math.round((best.net / best.income) * 100)}% saved`,
      context: `in ${bestName}`,
      trend: "up",
      sentiment: "positive",
      icon: "wallet-02",
      action: "Transactions",
      href: "/transactions",
    },
  ]
}

const KPIS = cashflowKpis()

const byName = (q: string) => (row: { name: string }) => row.name.toLowerCase().includes(q)

/** Cashflow — where money came from and where it went, Jan 1 – Sep 30 2026. */
export function CashflowView() {
  const [query, setQuery] = useState("")
  const q = query.trim().toLowerCase()

  return (
    <>
      <PageHeader
        searchLabel="Search sources and categories"
        title="Cashflow"
        subtitle="Where your money comes from and where it goes."
        query={query}
        onQueryChange={setQuery}
      />
      <PageContent>
        <KpiCards items={KPIS} label="Cashflow summary" />
        <CashFlowCard />
        <MonthlyTable />
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
          <BreakdownCard
            id="income-sources"
            title="Income sources"
            rows={SOURCES.filter(byName(q))}
            total={CASHFLOW_TOTALS.income}
            sign={1}
            query={query}
            action={<CardAction label="View all" href="/transactions" />}
            delay={240}
          />
          <BreakdownCard
            id="spending-categories"
            title="Spending by category"
            rows={CATEGORIES.filter(byName(q))}
            total={CASHFLOW_TOTALS.expenses}
            sign={-1}
            query={query}
            action={<CardAction label="View all" href="/transactions" />}
            delay={280}
          />
        </div>
      </PageContent>
    </>
  )
}
