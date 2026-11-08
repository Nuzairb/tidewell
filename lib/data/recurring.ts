import { UPCOMING } from "./planning"
import type { Transaction } from "./transactions"

/**
 * Everything that repeats: income, bills and subscriptions.
 * Static prototype data — there is NO backend.
 */

export type RecurringKind = "income" | "bill" | "subscription"

export const RECURRING_GROUPS: { id: RecurringKind; label: string }[] = [
  { id: "income", label: "Income" },
  { id: "bill", label: "Bills" },
  { id: "subscription", label: "Subscriptions" },
]

export type RecurringSeries = {
  id: string
  kind: RecurringKind
  name: string
  category: string
  frequency: "monthly" | "yearly"
  /** next occurrence, ISO yyyy-mm-dd */
  next: string
  method: Transaction["method"]
  amount: number // positive = income
  /** Account id (see ACCOUNTS) */
  account: string
  /** amount varies (utilities, freelance) */
  estimated?: boolean
  /** "Remind me" starts on */
  remind?: boolean
}

/** Charges come from UPCOMING so this screen and Home's Upcoming card can't disagree. */
function fromUpcoming(name: string): Pick<RecurringSeries, "next" | "method" | "amount" | "estimated"> {
  const bill = UPCOMING.find((b) => b.name === name)
  if (!bill) throw new Error(`No upcoming charge named "${name}"`)
  return { next: bill.date, method: bill.method, amount: bill.amount, estimated: bill.estimated }
}

export const RECURRING: RecurringSeries[] = [
  {
    id: "r1",
    kind: "income",
    name: "Salary",
    category: "Income",
    frequency: "monthly",
    next: "2026-10-31",
    method: "Bank transfer",
    amount: 6200,
    account: "a1",
  },
  {
    id: "r2",
    kind: "income",
    name: "Freelance — Acme Co.",
    category: "Income",
    frequency: "monthly",
    next: "2026-10-17",
    method: "Bank transfer",
    amount: 1450,
    account: "a1",
    estimated: true,
  },
  { id: "r3", kind: "bill", name: "Monthly Rent", category: "Housing", frequency: "monthly", account: "a1", remind: true, ...fromUpcoming("Monthly Rent") },
  { id: "r4", kind: "bill", name: "Con Edison", category: "Utilities", frequency: "monthly", account: "a1", remind: true, ...fromUpcoming("Con Edison") },
  { id: "r5", kind: "subscription", name: "Equinox", category: "Health & Fitness", frequency: "monthly", account: "a4", ...fromUpcoming("Equinox") },
  { id: "r6", kind: "subscription", name: "Spotify", category: "Subscriptions", frequency: "monthly", account: "a4", ...fromUpcoming("Spotify") },
  { id: "r7", kind: "subscription", name: "Netflix", category: "Subscriptions", frequency: "monthly", account: "a4", remind: true, ...fromUpcoming("Netflix") },
  {
    // Billed once a year (last charged Sep 3), so it's the rest of September's Subscriptions spend
    id: "r8",
    kind: "subscription",
    name: "Squarespace Domains",
    category: "Subscriptions",
    frequency: "yearly",
    next: "2027-09-03",
    method: "Credit card",
    amount: -14.99,
    account: "a4",
  },
]
