import { ACCOUNTS, TODAY } from "@/lib/data"
import type { RecurringSeries } from "@/lib/data/recurring"
import { parseIsoDate } from "@/lib/format"

const DAY_MS = 86_400_000

/** What a series costs (or brings in) per month — yearly charges spread over 12. */
export const perMonth = (s: RecurringSeries) => (s.frequency === "yearly" ? s.amount / 12 : s.amount)

export const sumPerMonth = (series: RecurringSeries[]) => series.reduce((sum, s) => sum + perMonth(s), 0)

export function dueIn(iso: string) {
  const days = Math.round((parseIsoDate(iso).getTime() - TODAY.getTime()) / DAY_MS)
  if (days === 0) return "Today"
  if (days === 1) return "Tomorrow"
  return `In ${days} days`
}

/** "Platinum Card ••3007" */
export function accountLabel(id: string) {
  const account = ACCOUNTS.find((a) => a.id === id)
  return account ? `${account.name} ••${account.mask}` : ""
}
