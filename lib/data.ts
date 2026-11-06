/**
 * Static prototype data. There is NO backend — everything on the page is
 * derived from these constants (and the Figma chart export).
 */

export type IconName =
  | "home-line"
  | "user-circle"
  | "coins-swap-01"
  | "bar-chart-circle-01"
  | "pie-chart-01"
  | "layers-three-01"
  | "wallet-02"
  | "calendar"
  | "target-05"
  | "bar-chart-11"
  | "monitor-04"
  | "file-03"
  | "file-shield-01"
  | "message-question-square"
  | "moon-02"
  | "settings-01"
  | "search-lg"
  | "help-circle"
  | "bell-01"
  | "chevron-down"
  | "chevron-right"
  | "chevron-selector-vertical"
  | "download-01-alt"
  | "credit-card-down"
  | "minus-circle"
  | "line-chart-up-05"
  | "align-left-01"

export type NavLink = { id: string; label: string; icon: IconName }
export type NavGroup = NavLink & { children?: NavLink[] }

export const PRIMARY_NAV: NavLink[] = [
  { id: "home", label: "Home", icon: "home-line" },
  { id: "accounts", label: "Accounts", icon: "user-circle" },
  { id: "transactions", label: "Transactions", icon: "coins-swap-01" },
  { id: "cashflow", label: "Cashflow", icon: "bar-chart-circle-01" },
  { id: "reports", label: "Reports", icon: "pie-chart-01" },
]

export const SECONDARY_NAV: NavGroup[] = [
  {
    id: "planning",
    label: "Planning",
    icon: "layers-three-01",
    children: [
      { id: "budget", label: "Budget", icon: "wallet-02" },
      { id: "recurring", label: "Recurring", icon: "calendar" },
      { id: "goals", label: "Goals", icon: "target-05" },
      { id: "investments", label: "Investments", icon: "bar-chart-11" },
    ],
  },
  { id: "analytics", label: "Analytics", icon: "monitor-04", children: [] },
  { id: "tracking", label: "Tracking", icon: "file-03", children: [] },
  { id: "data", label: "Data", icon: "file-shield-01", children: [] },
]

export const ACTIVE_PAGE = "reports"

export const USER = { name: "Liam Jonas", email: "liamjonas@gmail.com", initials: "LJ" }

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
  },
]

export type Transaction = {
  id: string
  date: string // ISO yyyy-mm-dd
  name: string
  category: string
  method: "Bank transfer" | "Credit card" | "Debit card"
  amount: number // positive = income
}

/** First five rows match Figma exactly; the rest appear under "View all". */
export const TRANSACTIONS: Transaction[] = [
  { id: "t1", date: "2026-09-30", name: "Salary", category: "Income", method: "Bank transfer", amount: 6200 },
  { id: "t2", date: "2026-09-28", name: "Whole Foods Market", category: "Food & Dining", method: "Credit card", amount: -86.45 },
  { id: "t3", date: "2026-09-26", name: "Monthly Rent", category: "Housing", method: "Bank transfer", amount: -2100 },
  { id: "t4", date: "2026-09-24", name: "Netflix", category: "Subscriptions", method: "Credit card", amount: -15.49 },
  { id: "t5", date: "2026-09-23", name: "Uber", category: "Transportation", method: "Debit card", amount: -24.8 },
  { id: "t6", date: "2026-09-21", name: "Blue Bottle Coffee", category: "Food & Dining", method: "Debit card", amount: -6.75 },
  { id: "t7", date: "2026-09-19", name: "Con Edison", category: "Utilities", method: "Bank transfer", amount: -112.3 },
  { id: "t8", date: "2026-09-17", name: "Freelance — Acme Co.", category: "Income", method: "Bank transfer", amount: 1450 },
  { id: "t9", date: "2026-09-15", name: "Spotify", category: "Subscriptions", method: "Credit card", amount: -11.99 },
  { id: "t10", date: "2026-09-12", name: "Trader Joe's", category: "Food & Dining", method: "Credit card", amount: -64.18 },
  { id: "t11", date: "2026-09-09", name: "Equinox", category: "Health & Fitness", method: "Credit card", amount: -185 },
  { id: "t12", date: "2026-09-05", name: "Delta Air Lines", category: "Travel", method: "Credit card", amount: -412.6 },
  { id: "t13", date: "2026-08-31", name: "Salary", category: "Income", method: "Bank transfer", amount: 6200 },
  { id: "t14", date: "2026-08-26", name: "Monthly Rent", category: "Housing", method: "Bank transfer", amount: -2100 },
  { id: "t15", date: "2026-08-14", name: "Apple Store", category: "Shopping", method: "Credit card", amount: -249 },
  { id: "t16", date: "2026-07-31", name: "Salary", category: "Income", method: "Bank transfer", amount: 6200 },
]

export const DEFAULT_RANGE = { from: new Date(2026, 0, 1), to: new Date(2026, 8, 30) }

export const NOTIFICATIONS = [
  { id: "n1", title: "Salary received", body: "+$6,200.00 landed in Checking.", time: "2h ago" },
  { id: "n2", title: "Budget alert", body: "Food & Dining is at 86% of September budget.", time: "1d ago" },
  { id: "n3", title: "Netflix renews soon", body: "$15.49 will be charged on Oct 24.", time: "3d ago" },
]

export const SHORTCUTS = [
  { keys: ["/"], label: "Focus search" },
  { keys: ["⌘", "B"], label: "Toggle sidebar" },
  { keys: ["←", "→"], label: "Step through chart (when focused)" },
  { keys: ["Esc"], label: "Clear search / close popovers" },
]
