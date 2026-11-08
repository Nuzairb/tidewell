import { StatCards, type Stat } from "@/components/dashboard/stat-cards"
import { dueIn, sumPerMonth } from "@/components/recurring/recurring-math"
import { RECURRING } from "@/lib/data/recurring"
import { formatBalance, formatSignedUsd, parseIsoDate } from "@/lib/format"

const dayFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" })

const income = RECURRING.filter((s) => s.kind === "income")
const subscriptions = RECURRING.filter((s) => s.kind === "subscription")
const costs = RECURRING.filter((s) => s.amount < 0)
const next = [...costs].sort((a, b) => a.next.localeCompare(b.next))[0]

const STATS: Stat[] = [
  {
    id: "fixed",
    label: "Fixed costs per month",
    value: formatBalance(-sumPerMonth(costs)),
    context: `${costs.length} bills and subscriptions`,
    icon: "wallet-02",
    action: "Budget",
    href: "/budget",
  },
  {
    id: "subscriptions",
    label: "Subscriptions per year",
    value: formatBalance(-sumPerMonth(subscriptions) * 12),
    context: `${subscriptions.length} active subscriptions`,
    icon: "coins-swap-01",
    action: "Transactions",
    href: "/transactions",
  },
  {
    id: "next",
    label: "Next charge",
    value: dayFmt.format(parseIsoDate(next.next)),
    context: `${next.name} · ${formatSignedUsd(next.amount)} · ${dueIn(next.next).toLowerCase()}`,
    icon: "credit-card-down",
    action: "Accounts",
    href: "/accounts",
  },
  {
    id: "income",
    label: "Recurring income",
    value: formatBalance(sumPerMonth(income)),
    context: "per month, freelance estimated",
    icon: "line-chart-up-05",
    action: "Cashflow",
    href: "/cashflow",
  },
]

/** The shared stat-card recipe without a trend line: these are commitments, not changes. */
export function RecurringSummary() {
  return <StatCards items={STATS} label="Recurring summary" />
}
