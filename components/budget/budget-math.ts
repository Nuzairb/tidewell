import { BUDGET_WARNING, type Budget } from "@/lib/data"

export type CategoryRow = Budget & {
  /** spent / limit */
  used: number
  /** limit − spent; negative = over */
  left: number
  /** turns the meter and figures red */
  warn: boolean
}

export function toRow(budget: Budget): CategoryRow {
  const used = budget.limit > 0 ? budget.spent / budget.limit : 1
  // fixed costs are always "fully used" by design, so they never warn
  return { ...budget, used, left: budget.limit - budget.spent, warn: !budget.fixed && used >= BUDGET_WARNING }
}

/** Tracked categories closest to (or over) their limit first; fixed costs last. */
export function sortRows(rows: CategoryRow[]): CategoryRow[] {
  return [...rows].sort((a, b) => Number(Boolean(a.fixed)) - Number(Boolean(b.fixed)) || b.used - a.used)
}

export function totalsOf(budgets: Budget[]) {
  const budgeted = budgets.reduce((sum, b) => sum + b.limit, 0)
  const spent = budgets.reduce((sum, b) => sum + b.spent, 0)
  return { budgeted, spent, left: budgeted - spent, used: budgeted > 0 ? spent / budgeted : 0 }
}

/** Whole dollars only; anything else keeps Save disabled. */
export function parseLimit(value: string): number | undefined {
  const trimmed = value.trim()
  if (!/^\d{1,6}$/.test(trimmed)) return undefined
  return Number(trimmed)
}
