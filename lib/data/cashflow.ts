/**
 * Cashflow: where money came from and went, month by month, Jan → Sep 2026.
 * Static prototype data — there is NO backend.
 *
 * Every figure below is derived from the two breakdowns, so the monthly table,
 * the income-source card and the spending card always agree with each other
 * and with the Reports KPIs (income $60,672.40 · expenses $41,104.25).
 * September matches the ledger: salary + Acme freelance in, budgets + Delta out.
 */

export const CASHFLOW_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"] as const

export type CashflowLine = {
  id: string
  name: string
  /** one amount per CASHFLOW_MONTHS entry, always positive */
  monthly: number[]
}

export const INCOME_SOURCES: CashflowLine[] = [
  { id: "salary", name: "Salary", monthly: [6200, 6200, 6200, 6200, 6200, 6200, 6200, 6200, 6200] },
  { id: "freelance", name: "Freelance", monthly: [0, 0, 1100, 0, 0, 1100, 0, 0, 1450] },
  { id: "tax-refund", name: "Tax refund", monthly: [0, 0, 0, 842.4, 0, 0, 0, 0, 0] },
  { id: "cashback", name: "Cashback & refunds", monthly: [120, 0, 0, 0, 140, 0, 0, 120, 0] },
]

export const SPENDING_CATEGORIES: CashflowLine[] = [
  { id: "housing", name: "Housing", monthly: [2100, 2100, 2100, 2100, 2100, 2100, 2100, 2100, 2100] },
  {
    id: "food",
    name: "Food & Dining",
    monthly: [612.4, 548.15, 587.92, 634.1, 571.36, 655.8, 702.44, 598.23, 516],
  },
  { id: "travel", name: "Travel", monthly: [0, 0, 1284.5, 0, 0, 3126.8, 845.2, 0, 412.6] },
  {
    id: "other",
    name: "Gifts & other",
    monthly: [486.2, 312.4, 268.75, 1104.32, 395.6, 420.15, 286.4, 1128.25, 0],
  },
  {
    id: "shopping",
    name: "Shopping",
    monthly: [214.3, 96.8, 342.15, 188.4, 265.7, 154.25, 301.6, 489.35, 122],
  },
  { id: "health", name: "Health & Fitness", monthly: [185, 185, 185, 185, 185, 185, 185, 185, 185] },
  {
    id: "transportation",
    name: "Transportation",
    monthly: [138.2, 121.75, 164.3, 142.6, 155.9, 171.25, 118.4, 146.85, 96],
  },
  {
    id: "utilities",
    name: "Utilities",
    monthly: [168.45, 159.3, 141.8, 122.65, 109.4, 128.9, 147.25, 139.6, 112.3],
  },
  {
    id: "subscriptions",
    name: "Subscriptions",
    monthly: [42.47, 42.47, 42.47, 42.47, 42.47, 42.47, 42.47, 42.47, 42.47],
  },
]

/** Sums in cents so float drift never shows up as a stray cent in a total. */
const sumCents = (values: number[]) => values.reduce((total, v) => total + Math.round(v * 100), 0) / 100

const monthTotal = (lines: CashflowLine[], month: number) => sumCents(lines.map((l) => l.monthly[month]))

export type CashflowMonth = { month: string; income: number; expenses: number; net: number }

export const MONTHLY_CASHFLOW: CashflowMonth[] = CASHFLOW_MONTHS.map((month, i) => {
  const income = monthTotal(INCOME_SOURCES, i)
  const expenses = monthTotal(SPENDING_CATEGORIES, i)
  return { month, income, expenses, net: sumCents([income, -expenses]) }
})

export type CashflowShare = { id: string; name: string; amount: number; share: number }

/** Period totals per line, largest first, with each line's share of the whole. */
export function periodShares(lines: CashflowLine[]): CashflowShare[] {
  const amounts = lines.map((l) => ({ id: l.id, name: l.name, amount: sumCents(l.monthly) }))
  const total = sumCents(amounts.map((a) => a.amount))
  return amounts.map((a) => ({ ...a, share: a.amount / total })).sort((a, b) => b.amount - a.amount)
}

export const CASHFLOW_TOTALS = {
  income: sumCents(MONTHLY_CASHFLOW.map((m) => m.income)),
  expenses: sumCents(MONTHLY_CASHFLOW.map((m) => m.expenses)),
  net: sumCents(MONTHLY_CASHFLOW.map((m) => m.net)),
}
