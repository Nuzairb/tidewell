import { CASHFLOW_MONTHS, MONTHLY_CASHFLOW, SPENDING_CATEGORIES } from "./cashflow"
import { BUDGETS, MONTH_INCOME, type Budget } from "./planning"

/**
 * Budget history for the Budget screen: July and August next to September's BUDGETS.
 * Static prototype data — there is NO backend.
 */

export type BudgetMonth = {
  id: string
  /** "September" */
  label: string
  /** "Sep" */
  short: string
  year: number
  /** last day of the month, ISO yyyy-mm-dd */
  end: string
  income: number
  budgets: Budget[]
}

/** Budget category → Cashflow spending line, so past months match the Cashflow screen. */
const CASHFLOW_LINE: Record<string, string> = {
  b1: "housing",
  b2: "health",
  b3: "food",
  b4: "utilities",
  b5: "subscriptions",
  b6: "transportation",
  b7: "shopping",
}

/** Same categories and limits as September; spent comes from that month's Cashflow figures. */
function monthBudgets(month: (typeof CASHFLOW_MONTHS)[number]): Budget[] {
  const i = CASHFLOW_MONTHS.indexOf(month)
  return BUDGETS.map((b) => ({
    ...b,
    spent: SPENDING_CATEGORIES.find((line) => line.id === CASHFLOW_LINE[b.id])!.monthly[i],
  }))
}

const incomeIn = (month: (typeof CASHFLOW_MONTHS)[number]) =>
  MONTHLY_CASHFLOW[CASHFLOW_MONTHS.indexOf(month)].income

/** Oldest first. September is the current month (TODAY = Sep 30). */
export const BUDGET_MONTHS: BudgetMonth[] = [
  {
    id: "2026-07",
    label: "July",
    short: "Jul",
    year: 2026,
    end: "2026-07-31",
    income: incomeIn("Jul"),
    budgets: monthBudgets("Jul"),
  },
  {
    id: "2026-08",
    label: "August",
    short: "Aug",
    year: 2026,
    end: "2026-08-31",
    income: incomeIn("Aug"),
    // Shopping includes the Apple Store purchase in TRANSACTIONS
    budgets: monthBudgets("Aug"),
  },
  {
    id: "2026-09",
    label: "September",
    short: "Sep",
    year: 2026,
    end: "2026-09-30",
    income: MONTH_INCOME,
    budgets: BUDGETS,
  },
]
