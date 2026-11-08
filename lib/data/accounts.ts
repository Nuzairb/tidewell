import type { Transaction } from "./transactions"

/**
 * Linked accounts, their history and in-account activity.
 * Static prototype data — there is NO backend.
 */

export type AccountGroup = "cash" | "investments" | "credit"

export const ACCOUNT_GROUPS: { id: AccountGroup; label: string }[] = [
  { id: "cash", label: "Cash" },
  { id: "investments", label: "Investments" },
  { id: "credit", label: "Credit" },
]

export type Account = {
  id: string
  group: AccountGroup
  name: string
  institution: string
  /** institution initials for the tile */
  initials: string
  kind: string
  mask: string
  balance: number
  /** change over the current month */
  monthChange: number
  /** month-end balances, Apr → Sep (last = balance) */
  history: number[]
  /** key facts for the detail panel */
  facts: { label: string; value: string }[]
  /** credit cards only */
  creditLimit?: number
}

/** Balances add up to the "Total balance" KPI on Reports ($83,820.35). */
export const ACCOUNTS: Account[] = [
  {
    id: "a1",
    group: "cash",
    name: "Everyday Checking",
    institution: "Chase",
    initials: "CH",
    kind: "Checking",
    mask: "4021",
    balance: 12486.22,
    monthChange: 3962.11,
    history: [7820, 9140, 8410, 10260, 8524.11, 12486.22],
    facts: [
      { label: "Available", value: "$12,486.22" },
      { label: "Routing number", value: "••0021" },
      { label: "Opened", value: "Mar 2019" },
      { label: "Last synced", value: "Today, 9:41 AM" },
    ],
  },
  {
    id: "a2",
    group: "cash",
    name: "High-Yield Savings",
    institution: "Ally",
    initials: "AL",
    kind: "Savings",
    mask: "7730",
    balance: 21350,
    monthChange: 800,
    history: [17350, 18150, 18950, 19750, 20550, 21350],
    facts: [
      { label: "APY", value: "4.10%" },
      { label: "Interest this year", value: "$612.40" },
      { label: "Auto-transfer", value: "$800 on the 30th" },
      { label: "Last synced", value: "Today, 9:41 AM" },
    ],
  },
  {
    id: "a3",
    group: "investments",
    name: "Index Portfolio",
    institution: "Vanguard",
    initials: "VG",
    kind: "Brokerage",
    mask: "1188",
    balance: 51268.73,
    monthChange: 1124.56,
    history: [44210.4, 45980.12, 47310.88, 48905.3, 50144.17, 51268.73],
    facts: [
      { label: "Contributed this year", value: "$9,000.00" },
      { label: "Return this year", value: "+8.4%" },
      { label: "Holdings", value: "4 funds" },
      { label: "Last synced", value: "Today, 6:00 AM" },
    ],
  },
  {
    id: "a4",
    group: "credit",
    name: "Platinum Card",
    institution: "Amex",
    initials: "AX",
    kind: "Credit card",
    mask: "3007",
    balance: -1284.6,
    monthChange: -312.4,
    history: [-1840.2, -960.5, -2210.75, -1490.3, -972.2, -1284.6],
    creditLimit: 15000,
    facts: [
      { label: "Available credit", value: "$13,715.40" },
      { label: "Statement due", value: "Oct 18" },
      { label: "Minimum payment", value: "$35.00" },
      { label: "Last synced", value: "Today, 9:41 AM" },
    ],
  },
]

/** Month labels for Account.history */
export const HISTORY_MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"]

/**
 * Money moving inside savings and investments. Kept out of TRANSACTIONS so
 * transfers and market activity don't count as income on Reports.
 */
export const ACCOUNT_ACTIVITY: Transaction[] = [
  { id: "s1", date: "2026-09-30", name: "Transfer from Checking", category: "Transfer", method: "Bank transfer", amount: 800, account: "a2" },
  { id: "s2", date: "2026-09-30", name: "Interest", category: "Interest", method: "Bank transfer", amount: 71.84, account: "a2" },
  { id: "s3", date: "2026-08-31", name: "Transfer from Checking", category: "Transfer", method: "Bank transfer", amount: 800, account: "a2" },
  { id: "s4", date: "2026-08-31", name: "Interest", category: "Interest", method: "Bank transfer", amount: 69.12, account: "a2" },
  { id: "i1", date: "2026-09-29", name: "VTSAX dividend", category: "Dividend", method: "Bank transfer", amount: 212.38, account: "a3" },
  { id: "i2", date: "2026-09-15", name: "Monthly contribution", category: "Contribution", method: "Bank transfer", amount: 1000, account: "a3" },
  { id: "i3", date: "2026-08-15", name: "Monthly contribution", category: "Contribution", method: "Bank transfer", amount: 1000, account: "a3" },
  { id: "i4", date: "2026-07-15", name: "Monthly contribution", category: "Contribution", method: "Bank transfer", amount: 1000, account: "a3" },
]
