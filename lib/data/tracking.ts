import type { Transaction } from "./transactions"

/**
 * Tracking: tags followed across categories and accounts.
 * Static prototype data — there is NO backend.
 * Totals, counts and profit are derived from TAGGED_TRANSACTIONS, never stored.
 */

export type Tag = {
  id: string
  name: string
  /** initials for the tile */
  initials: string
  /** optional spending cap for the whole tag */
  budget?: number
  start: string // ISO yyyy-mm-dd
  /** open-ended tags (an ongoing client) have no end */
  end?: string
  note: string
}

export const TAGS: Tag[] = [
  {
    id: "japan",
    name: "Japan trip 2027",
    initials: "JP",
    budget: 6000,
    start: "2026-06-01",
    end: "2027-04-30",
    note: "Flights, rail pass and stays, booked ahead.",
  },
  {
    id: "office",
    name: "Home office",
    initials: "HO",
    budget: 2500,
    start: "2026-07-01",
    end: "2026-09-30",
    note: "Desk, chair and screen for working from home.",
  },
  {
    id: "acme",
    name: "Freelance — Acme",
    initials: "AC",
    start: "2026-06-01",
    note: "Paid per project, less the tools it needs.",
  },
  {
    id: "wedding",
    name: "Sam & Ana's wedding",
    initials: "SA",
    budget: 1200,
    start: "2026-05-01",
    end: "2026-10-10",
    note: "Gift, flights and two nights in Napa.",
  },
  {
    id: "gifts",
    name: "Holiday gifts",
    initials: "HG",
    budget: 800,
    start: "2026-09-01",
    end: "2026-12-31",
    note: "Started early this year.",
  },
]

export type TaggedTransaction = Transaction & { tag: string }

/** Shaped like Transaction so TransactionsCard can render them. Newest first. */
export const TAGGED_TRANSACTIONS: TaggedTransaction[] = [
  { id: "tg1", date: "2026-09-27", name: "Uncommon Goods", category: "Shopping", method: "Credit card", amount: -77.9, account: "a4", tag: "gifts" },
  { id: "tg2", date: "2026-09-25", name: "Marriott Napa", category: "Travel", method: "Credit card", amount: -412, account: "a4", tag: "wedding" },
  { id: "tg3", date: "2026-09-22", name: "Wise — yen top-up", category: "Travel", method: "Debit card", amount: -250, account: "a1", tag: "japan" },
  { id: "tg4", date: "2026-09-17", name: "Freelance — Acme Co.", category: "Income", method: "Bank transfer", amount: 1450, account: "a1", tag: "acme" },
  { id: "tg5", date: "2026-09-14", name: "Etsy", category: "Shopping", method: "Credit card", amount: -68.5, account: "a4", tag: "gifts" },
  { id: "tg6", date: "2026-09-11", name: "Logitech", category: "Shopping", method: "Credit card", amount: -129.99, account: "a4", tag: "office" },
  { id: "tg7", date: "2026-09-08", name: "Lonely Planet Japan", category: "Shopping", method: "Credit card", amount: -29.99, account: "a4", tag: "japan" },
  { id: "tg8", date: "2026-09-02", name: "WeWork day passes", category: "Business", method: "Credit card", amount: -120, account: "a4", tag: "acme" },
  { id: "tg9", date: "2026-08-28", name: "Adobe Creative Cloud", category: "Subscriptions", method: "Credit card", amount: -59.99, account: "a4", tag: "acme" },
  { id: "tg10", date: "2026-08-21", name: "Amazon", category: "Shopping", method: "Credit card", amount: -148.36, account: "a4", tag: "office" },
  { id: "tg11", date: "2026-08-19", name: "Hoshinoya Kyoto deposit", category: "Travel", method: "Credit card", amount: -380, account: "a4", tag: "japan" },
  { id: "tg13", date: "2026-08-09", name: "Delta Air Lines", category: "Travel", method: "Credit card", amount: -318.4, account: "a4", tag: "wedding" },
  { id: "tg14", date: "2026-08-03", name: "Dell", category: "Shopping", method: "Credit card", amount: -389.99, account: "a4", tag: "office" },
  { id: "tg15", date: "2026-07-18", name: "Herman Miller", category: "Shopping", method: "Credit card", amount: -1095, account: "a4", tag: "office" },
  { id: "tg17", date: "2026-07-10", name: "Figma", category: "Subscriptions", method: "Credit card", amount: -45, account: "a4", tag: "acme" },
  { id: "tg18", date: "2026-07-06", name: "IKEA", category: "Home & Garden", method: "Credit card", amount: -612.4, account: "a4", tag: "office" },
  { id: "tg19", date: "2026-07-02", name: "Japan Rail Pass", category: "Travel", method: "Credit card", amount: -412, account: "a4", tag: "japan" },
  { id: "tg20", date: "2026-07-01", name: "WeWork day passes", category: "Business", method: "Credit card", amount: -180, account: "a4", tag: "acme" },
  { id: "tg16", date: "2026-06-16", name: "Freelance — Acme Co.", category: "Income", method: "Bank transfer", amount: 1100, account: "a1", tag: "acme" },
  { id: "tg21", date: "2026-06-14", name: "ANA — flight deposit", category: "Travel", method: "Credit card", amount: -1284, account: "a4", tag: "japan" },
  { id: "tg22", date: "2026-05-20", name: "Zola registry", category: "Gifts", method: "Credit card", amount: -250, account: "a4", tag: "wedding" },
]
