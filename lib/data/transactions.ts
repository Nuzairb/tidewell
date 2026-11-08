/**
 * Transactions (income and spending) and the prototype's "today".
 * Static prototype data — there is NO backend.
 */

/**
 * The prototype's "today" is the last day of the mock data, so September is
 * the current month and October holds everything upcoming.
 */
export const TODAY = new Date(2026, 8, 30)

export type Transaction = {
  id: string
  date: string // ISO yyyy-mm-dd
  name: string
  category: string
  method: "Bank transfer" | "Credit card" | "Debit card"
  amount: number // positive = income
  /** Account id (see ACCOUNTS) */
  account: string
}

/** First five rows match Figma exactly; the rest appear under "View all". */
export const TRANSACTIONS: Transaction[] = [
  { id: "t1", date: "2026-09-30", name: "Salary", category: "Income", method: "Bank transfer", amount: 6200, account: "a1" },
  { id: "t2", date: "2026-09-28", name: "Whole Foods Market", category: "Food & Dining", method: "Credit card", amount: -86.45, account: "a4" },
  { id: "t3", date: "2026-09-26", name: "Monthly Rent", category: "Housing", method: "Bank transfer", amount: -2100, account: "a1" },
  { id: "t4", date: "2026-09-24", name: "Netflix", category: "Subscriptions", method: "Credit card", amount: -15.49, account: "a4" },
  { id: "t5", date: "2026-09-23", name: "Uber", category: "Transportation", method: "Debit card", amount: -24.8, account: "a1" },
  { id: "t6", date: "2026-09-21", name: "Blue Bottle Coffee", category: "Food & Dining", method: "Debit card", amount: -6.75, account: "a1" },
  { id: "t7", date: "2026-09-19", name: "Con Edison", category: "Utilities", method: "Bank transfer", amount: -112.3, account: "a1" },
  { id: "t8", date: "2026-09-17", name: "Freelance — Acme Co.", category: "Income", method: "Bank transfer", amount: 1450, account: "a1" },
  { id: "t9", date: "2026-09-15", name: "Spotify", category: "Subscriptions", method: "Credit card", amount: -11.99, account: "a4" },
  { id: "t10", date: "2026-09-12", name: "Trader Joe's", category: "Food & Dining", method: "Credit card", amount: -64.18, account: "a4" },
  { id: "t11", date: "2026-09-09", name: "Equinox", category: "Health & Fitness", method: "Credit card", amount: -185, account: "a4" },
  { id: "t12", date: "2026-09-05", name: "Delta Air Lines", category: "Travel", method: "Credit card", amount: -412.6, account: "a4" },
  { id: "t13", date: "2026-08-31", name: "Salary", category: "Income", method: "Bank transfer", amount: 6200, account: "a1" },
  { id: "t14", date: "2026-08-26", name: "Monthly Rent", category: "Housing", method: "Bank transfer", amount: -2100, account: "a1" },
  { id: "t15", date: "2026-08-14", name: "Apple Store", category: "Shopping", method: "Credit card", amount: -249, account: "a4" },
  { id: "t16", date: "2026-07-31", name: "Salary", category: "Income", method: "Bank transfer", amount: 6200, account: "a1" },
]
