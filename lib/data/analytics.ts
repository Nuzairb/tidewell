/**
 * Analytics: where the Jan 1 – Sep 30 2026 spending went.
 * Static prototype data — there is NO backend.
 * Monthly and category totals come from lib/data/cashflow.ts (sum: $41,104.25,
 * the Reports "Total expenses" KPI). Merchants never exceed their category.
 */

import { MONTHLY_CASHFLOW, periodShares, SPENDING_CATEGORIES } from "./cashflow"

export type MonthSpend = { month: string; label: string; amount: number }

const monthName = new Intl.DateTimeFormat("en-US", { month: "long" })

/** Derived from Cashflow's breakdown so the two screens can never disagree. */
export const MONTHLY_SPEND: MonthSpend[] = MONTHLY_CASHFLOW.map((m, i) => ({
  month: m.month,
  label: monthName.format(new Date(2026, i, 1)),
  amount: m.expenses,
}))

/** Jan 1 – Sep 30 2025 — the "+4.7% vs last year" on Reports. */
export const PREVIOUS_PERIOD_SPEND = 39259.07

export type CategorySpend = { category: string; amount: number }

export const CATEGORY_SPEND: CategorySpend[] = periodShares(SPENDING_CATEGORIES).map((c) => ({
  category: c.name,
  amount: c.amount,
}))

/** Categories that are fixed costs, left out of "everyday" comparisons. */
export const FIXED_CATEGORIES = ["Housing"]

export type MerchantSpend = { id: string; merchant: string; category: string; visits: number; total: number }

export const TOP_MERCHANTS: MerchantSpend[] = [
  { id: "m1", merchant: "Monthly Rent", category: "Housing", visits: 9, total: 18900 },
  { id: "m2", merchant: "Delta Air Lines", category: "Travel", visits: 4, total: 2184.4 },
  { id: "m3", merchant: "Whole Foods Market", category: "Food & Dining", visits: 38, total: 2046.72 },
  { id: "m4", merchant: "Amazon", category: "Shopping", visits: 19, total: 1184.19 },
  { id: "m5", merchant: "Equinox", category: "Health & Fitness", visits: 9, total: 1665 },
  { id: "m6", merchant: "Airbnb", category: "Travel", visits: 2, total: 1412 },
  { id: "m7", merchant: "Trader Joe's", category: "Food & Dining", visits: 22, total: 1198.6 },
  { id: "m8", merchant: "Uber", category: "Transportation", visits: 46, total: 1106.25 },
  { id: "m9", merchant: "Con Edison", category: "Utilities", visits: 9, total: 1021.84 },
  { id: "m10", merchant: "IKEA", category: "Gifts & other", visits: 3, total: 968.4 },
  { id: "m11", merchant: "Apple Store", category: "Shopping", visits: 2, total: 498 },
  { id: "m12", merchant: "Blue Bottle Coffee", category: "Food & Dining", visits: 71, total: 479.25 },
  { id: "m13", merchant: "Netflix", category: "Subscriptions", visits: 9, total: 139.41 },
  { id: "m14", merchant: "Spotify", category: "Subscriptions", visits: 9, total: 107.91 },
]

export type WeekdaySpend = { day: string; label: string; amount: number }

/** Everyday spending by weekday — rent excluded, so it sums to total minus Housing. */
export const WEEKDAY_SPEND: WeekdaySpend[] = [
  { day: "Mon", label: "Monday", amount: 2611.4 },
  { day: "Tue", label: "Tuesday", amount: 2486.18 },
  { day: "Wed", label: "Wednesday", amount: 2702.92 },
  { day: "Thu", label: "Thursday", amount: 2958.07 },
  { day: "Fri", label: "Friday", amount: 3840.66 },
  { day: "Sat", label: "Saturday", amount: 4512.31 },
  { day: "Sun", label: "Sunday", amount: 3092.71 },
]
