import type { Stat } from "@/components/dashboard/stat-cards"
import { BUDGETS, type IconName } from "@/lib/data"
import {
  CATEGORY_SPEND,
  FIXED_CATEGORIES,
  MONTHLY_SPEND,
  PREVIOUS_PERIOD_SPEND,
  WEEKDAY_SPEND,
} from "@/lib/data/analytics"
import { formatSignedUsd, formatUsd, formatUsdWhole } from "@/lib/format"

/** Everything on Analytics is derived here from the raw breakdowns. */

const sum = (rows: { amount: number }[]) => rows.reduce((total, r) => total + r.amount, 0)
const pct = (n: number) => `${Math.round(n * 100)}%`

export const TOTAL_SPENT = sum(CATEGORY_SPEND)
export const MONTH_AVERAGE = TOTAL_SPENT / MONTHLY_SPEND.length

const byAmount = <T extends { amount: number }>(rows: T[]) => [...rows].sort((a, b) => b.amount - a.amount)

const [biggest] = byAmount(CATEGORY_SPEND)
const change = TOTAL_SPENT - PREVIOUS_PERIOD_SPEND
const changeRatio = change / PREVIOUS_PERIOD_SPEND

export const ANALYTICS_STATS: Stat[] = [
  {
    id: "total",
    label: "Total spent",
    value: formatUsd(TOTAL_SPENT),
    context: "Jan 1 – Sep 30, 2026",
    icon: "minus-circle",
    action: "Transactions",
    href: "/transactions",
  },
  {
    id: "average",
    label: "Average per month",
    value: formatUsd(MONTH_AVERAGE),
    context: `across ${MONTHLY_SPEND.length} months`,
    icon: "calendar",
    action: "Cashflow",
    href: "/cashflow",
  },
  {
    id: "biggest",
    label: "Biggest category",
    value: formatUsd(biggest.amount),
    context: `${biggest.category} · ${pct(biggest.amount / TOTAL_SPENT)} of spend`,
    icon: "pie-chart-01",
    action: "Budget",
    href: "/budget",
  },
  {
    id: "change",
    label: "Change vs last year",
    value: formatSignedUsd(change),
    context: "vs Jan–Sep 2025",
    // spending more is the bad direction
    change: {
      text: `${change >= 0 ? "+" : "−"}${(Math.abs(changeRatio) * 100).toFixed(1)}%`,
      trend: change >= 0 ? "up" : "down",
      sentiment: change >= 0 ? "negative" : "positive",
    },
    icon: "line-chart-up-05",
    action: "Reports",
    href: "/reports",
  },
]

export type Insight = { id: string; icon: IconName; title: string; body: string }

function buildInsights(): Insight[] {
  const months = byAmount(MONTHLY_SPEND)
  const priciest = months[0]
  const days = byAmount(WEEKDAY_SPEND)
  const everyday = sum(WEEKDAY_SPEND)
  const [topEveryday] = byAmount(CATEGORY_SPEND.filter((c) => !FIXED_CATEGORIES.includes(c.category)))
  const perMonth = topEveryday.amount / MONTHLY_SPEND.length
  const budget = BUDGETS.find((b) => b.category === topEveryday.category)

  return [
    {
      id: "month",
      icon: "bar-chart-11",
      title: `${priciest.label} was your priciest month`,
      body: `${formatUsd(priciest.amount)} — ${pct(priciest.amount / MONTH_AVERAGE - 1)} above your ${formatUsdWhole(MONTH_AVERAGE)} monthly average.`,
    },
    {
      id: "weekday",
      icon: "calendar",
      title: `${days[0].label}s cost the most`,
      body: `${pct(days[0].amount / everyday)} of everyday spending lands on a ${days[0].label} — ${(days[0].amount / days.at(-1)!.amount).toFixed(1)}× a ${days.at(-1)!.label}. Rent not included.`,
    },
    {
      id: "category",
      icon: "pie-chart-01",
      title: `${topEveryday.category} leads everyday spending`,
      body: budget
        ? `About ${formatUsdWhole(perMonth)} a month, against a ${formatUsdWhole(budget.limit)} monthly budget.`
        : `About ${formatUsdWhole(perMonth)} a month so far this year.`,
    },
  ]
}

export const INSIGHTS = buildInsights()
