import { toRow, type CategoryRow } from "@/components/budget/budget-math"
import { CardAction } from "@/components/dashboard/card-action"
import { SectionCard } from "@/components/dashboard/section-card"
import { Icon } from "@/components/icon"
import { TRANSACTIONS, type IconName } from "@/lib/data"
import type { BudgetMonth } from "@/lib/data/budget"
import { formatUsdWhole } from "@/lib/format"

type Insight = { id: string; icon: IconName; title: string; body: string }

/** Tracked (non-fixed) categories as rows, one array per month, oldest first. */
const tracked = (months: BudgetMonth[]) => months.map((m) => m.budgets.filter((b) => !b.fixed).map(toRow))

/** The category whose spend grew every month, by the largest share. */
function rising(months: BudgetMonth[], rows: CategoryRow[][]): (Insight & { category: string }) | undefined {
  const latest = rows[rows.length - 1]
  const climbing = latest
    .map((row) => {
      const series = rows.map((month) => month.find((r) => r.id === row.id)?.spent ?? 0)
      const isClimbing = series.every((v, i) => i === 0 || v > series[i - 1])
      return { row, series, growth: isClimbing && series[0] > 0 ? series[series.length - 1] / series[0] - 1 : 0 }
    })
    .filter((c) => c.growth > 0)
    .sort((a, b) => b.growth - a.growth)[0]
  if (!climbing) return undefined

  const { row, series, growth } = climbing
  const latestMonth = months[months.length - 1]
  const pressure = row.warn ? ` It's at ${Math.round(row.used * 100)}% of its ${formatUsdWhole(row.limit)} limit in ${latestMonth.label}.` : ""
  return {
    id: "rising",
    icon: "line-chart-up-05",
    category: row.category,
    title: `${row.category} keeps climbing`,
    body: `Up ${Math.round(growth * 100)}% since ${months[0].label}: ${series.map(formatUsdWhole).join(" → ")}.${pressure}`,
  }
}

/** The most recent month a category went over, and the biggest charge behind it. */
function overLimit(months: BudgetMonth[], rows: CategoryRow[][]): Insight | undefined {
  for (let i = rows.length - 1; i >= 0; i--) {
    const over = rows[i].filter((r) => r.left < 0).sort((a, b) => a.left - b.left)[0]
    if (!over) continue

    const month = months[i]
    const biggest = TRANSACTIONS.filter((t) => t.category === over.category && t.date.startsWith(month.id)).sort(
      (a, b) => a.amount - b.amount
    )[0]
    const cause = biggest ? ` ${biggest.name} alone was ${formatUsdWhole(-biggest.amount)}.` : ""
    const latest = rows[rows.length - 1].find((r) => r.id === over.id)
    const since =
      i < rows.length - 1 && latest
        ? ` Back to ${Math.round(latest.used * 100)}% in ${months[months.length - 1].label}.`
        : ""
    return {
      id: "over",
      icon: "minus-circle",
      title: `${over.category} went over in ${month.label}`,
      body: `${formatUsdWhole(over.spent)} of ${formatUsdWhole(over.limit)}.${cause}${since}`,
    }
  }
  return undefined
}

/** Most dollars left over on average, among categories that never went over. */
function room(rows: CategoryRow[][], exclude?: string): Insight | undefined {
  const best = rows[rows.length - 1]
    .filter((r) => r.category !== exclude && rows.every((month) => month.every((m) => m.id !== r.id || m.left >= 0)))
    .map((row) => {
      const spent = rows.reduce((sum, month) => sum + (month.find((r) => r.id === row.id)?.spent ?? 0), 0) / rows.length
      return { row, spent, spare: row.limit - spent }
    })
    .sort((a, b) => b.spare - a.spare)[0]
  if (!best || best.spare < best.row.limit * 0.1) return undefined

  return {
    id: "room",
    icon: "wallet-02",
    title: `${best.row.category} has room to spare`,
    body: `Averaging ${formatUsdWhole(best.spent)} of ${formatUsdWhole(best.row.limit)} over ${rows.length} months — about ${formatUsdWhole(best.spare)} a month you could move${exclude ? ` to ${exclude}` : " elsewhere"}.`,
  }
}

function insightsFor(months: BudgetMonth[]): Insight[] {
  const rows = tracked(months)
  const up = rising(months, rows)
  return [up, overLimit(months, rows), room(rows, up?.category)].filter((i): i is Insight => Boolean(i))
}

/** Plain-language observations across the months on record. */
export function BudgetInsights({ months, className }: { months: BudgetMonth[]; className?: string }) {
  const insights = insightsFor(months)
  return (
    <SectionCard
      id="budget-insights"
      title={`Last ${months.length} months`}
      action={<CardAction label="Reports" href="/reports" />}
      delay={40}
      className={className}
    >
      <ul className="flex flex-col border-t border-line">
        {insights.map(({ id, icon, title, body }) => (
          <li key={id} className="flex gap-3 border-b border-line px-4 py-3.5 last:border-b-0">
            <span
              aria-hidden
              className="flex size-[26px] shrink-0 items-center justify-center rounded-md bg-control shadow-control"
            >
              <Icon name={icon} />
            </span>
            <span className="flex min-w-0 flex-col gap-1.5 pt-1">
              <span className="text-sm font-medium text-fg">{title}</span>
              <span className="text-xs leading-[1.4] font-medium text-fg-muted tabular-nums">{body}</span>
            </span>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}
