import type { IconName } from "./nav"

/**
 * Reports: KPI figures and the default date range.
 * Static prototype data — there is NO backend.
 */

export type Kpi = {
  id: string
  label: string
  value: string
  change: string
  context: string
  /** direction of the number */
  trend: "up" | "down"
  /** whether this direction is good for the user (expenses up = bad) */
  sentiment: "positive" | "negative"
  icon: IconName
  action: string
  /** where the card's icon button goes; without it the button shows a "coming soon" toast */
  href?: string
}

export const KPIS: Kpi[] = [
  {
    id: "balance",
    label: "Total balance",
    value: "$83,820.35",
    change: "+30.5%",
    context: "since Jan 1",
    trend: "up",
    sentiment: "positive",
    icon: "wallet-02",
    action: "Accounts",
    href: "/accounts",
  },
  {
    id: "income",
    label: "Total income",
    value: "$60,672.40",
    change: "+7.7%",
    context: "vs last year",
    trend: "up",
    sentiment: "positive",
    icon: "credit-card-down",
    action: "Income",
    href: "/transactions",
  },
  {
    id: "expenses",
    label: "Total expenses",
    value: "$41,104.25",
    change: "+4.7%",
    context: "vs last year",
    trend: "up",
    sentiment: "negative",
    icon: "minus-circle",
    action: "Expenses",
    href: "/transactions",
  },
  {
    id: "net",
    label: "Net cashflow",
    value: "$19,568.15",
    change: "+14.7%",
    context: "vs last year",
    trend: "up",
    sentiment: "positive",
    icon: "line-chart-up-05",
    action: "Cashflow",
    href: "/cashflow",
  },
]

export const DEFAULT_RANGE = { from: new Date(2026, 0, 1), to: new Date(2026, 8, 30) }
