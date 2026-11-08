import type { Transaction } from "./transactions"

/**
 * Budgets, recurring bills and savings goals.
 * Static prototype data — there is NO backend.
 */

export type Budget = {
  id: string
  category: string
  spent: number
  limit: number
  /** fixed costs (rent) count toward the month but aren't tracked as budgets */
  fixed?: boolean
}

/** September, per category. Food & Dining matches the 86% budget alert. */
export const BUDGETS: Budget[] = [
  { id: "b1", category: "Housing", spent: 2100, limit: 2100, fixed: true },
  { id: "b2", category: "Health & Fitness", spent: 185, limit: 200 },
  { id: "b3", category: "Food & Dining", spent: 516, limit: 600 },
  { id: "b4", category: "Utilities", spent: 112.3, limit: 150 },
  { id: "b5", category: "Subscriptions", spent: 42.47, limit: 60 },
  { id: "b6", category: "Transportation", spent: 96, limit: 180 },
  { id: "b7", category: "Shopping", spent: 122, limit: 300 },
]

/** Share of a budget at which the meter turns negative. */
export const BUDGET_WARNING = 0.85

/** September income: salary + freelance (see TRANSACTIONS). */
export const MONTH_INCOME = 7650

export type Bill = {
  id: string
  date: string // ISO yyyy-mm-dd
  name: string
  method: Transaction["method"]
  amount: number // positive = income
  /** amount varies month to month (utilities) */
  estimated?: boolean
}

/** Next occurrence of each recurring transaction in TRANSACTIONS. */
export const UPCOMING: Bill[] = [
  { id: "u1", date: "2026-10-09", name: "Equinox", method: "Credit card", amount: -185 },
  { id: "u2", date: "2026-10-15", name: "Spotify", method: "Credit card", amount: -11.99 },
  { id: "u3", date: "2026-10-19", name: "Con Edison", method: "Bank transfer", amount: -118, estimated: true },
  { id: "u4", date: "2026-10-24", name: "Netflix", method: "Credit card", amount: -15.49 },
  { id: "u5", date: "2026-10-26", name: "Monthly Rent", method: "Bank transfer", amount: -2100 },
]

export type Goal = { id: string; name: string; saved: number; target: number; due: string }

export const GOALS: Goal[] = [
  { id: "g1", name: "Emergency fund", saved: 14200, target: 20000, due: "Jun 2027" },
  { id: "g2", name: "Trip to Japan", saved: 2450, target: 6000, due: "Apr 2027" },
  { id: "g3", name: "New laptop", saved: 1800, target: 2400, due: "Dec 2026" },
]
