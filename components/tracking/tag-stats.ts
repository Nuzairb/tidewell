import type { Stat } from "@/components/dashboard/stat-cards"
import { TAGGED_TRANSACTIONS, TAGS, type Tag } from "@/lib/data/tracking"
import { formatUsd, parseIsoDate } from "@/lib/format"

export type TagSummary = Tag & {
  spent: number
  income: number
  /** income − spent; only meaningful for tags that earn */
  net: number
  count: number
  /** transactions that cost money */
  expenseCount: number
  /** spent / budget, when there's a budget */
  used?: number
}

export function summarise(tag: Tag): TagSummary {
  const rows = TAGGED_TRANSACTIONS.filter((t) => t.tag === tag.id)
  const expenses = rows.filter((t) => t.amount < 0)
  const spent = -expenses.reduce((sum, t) => sum + t.amount, 0)
  const income = rows.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
  return {
    ...tag,
    spent,
    income,
    net: income - spent,
    count: rows.length,
    expenseCount: expenses.length,
    used: tag.budget ? spent / tag.budget : undefined,
  }
}

export const TAG_SUMMARIES = TAGS.map(summarise)

const monthYear = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" })

/** "Jun 2026 – Apr 2027", or "Since Jul 2026" for open-ended tags */
export function tagPeriod({ start, end }: Tag) {
  const from = monthYear.format(parseIsoDate(start))
  return end ? `${from} – ${monthYear.format(parseIsoDate(end))}` : `Since ${from}`
}

function summaryStats(): Stat[] {
  const spent = TAG_SUMMARIES.reduce((sum, t) => sum + t.spent, 0)
  const earning = TAG_SUMMARIES.filter((t) => t.income > 0)
  const income = earning.reduce((sum, t) => sum + t.income, 0)
  const budgeted = TAG_SUMMARIES.filter((t) => t.budget)
  const budget = budgeted.reduce((sum, t) => sum + (t.budget ?? 0), 0)
  const budgetSpent = budgeted.reduce((sum, t) => sum + t.spent, 0)
  const plural = (n: number) => `${n} tag${n === 1 ? "" : "s"}`

  return [
    {
      id: "spent",
      label: "Tracked spending",
      value: formatUsd(spent),
      context: `across ${plural(TAG_SUMMARIES.length)}`,
      icon: "minus-circle",
      action: "Transactions",
      href: "/transactions",
    },
    {
      id: "income",
      label: "Tracked income",
      value: formatUsd(income),
      context: `from ${plural(earning.length)}`,
      icon: "credit-card-down",
      action: "Transactions",
      href: "/transactions",
    },
    {
      id: "budgeted",
      label: "Budgeted",
      value: formatUsd(budget),
      context: `on ${budgeted.length} of ${TAG_SUMMARIES.length} tags`,
      icon: "wallet-02",
      action: "Budget",
      href: "/budget",
    },
    {
      id: "left",
      label: "Budget left",
      value: formatUsd(budget - budgetSpent),
      context: `${Math.round((budgetSpent / budget) * 100)}% used`,
      icon: "target-05",
      action: "Goals",
      href: "/goals",
    },
  ]
}

export const TRACKING_STATS = summaryStats()
