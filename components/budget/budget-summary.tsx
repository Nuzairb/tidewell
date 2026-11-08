import { totalsOf } from "@/components/budget/budget-math"
import { SectionCard } from "@/components/dashboard/section-card"
import { Meter } from "@/components/ui/meter"
import { TODAY, type Budget } from "@/lib/data"
import type { BudgetMonth } from "@/lib/data/budget"
import { formatBalance, parseIsoDate } from "@/lib/format"
import { cn } from "@/lib/utils"

const DAY_MS = 86_400_000
const dayFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" })

/** "Last day" / "3 days left" / "Ended Aug 31" relative to TODAY. */
export function monthStatus(month: BudgetMonth) {
  const end = parseIsoDate(month.end)
  const days = Math.round((end.getTime() - TODAY.getTime()) / DAY_MS)
  const endLabel = dayFmt.format(end)
  if (days < 0) return { isOpen: false, short: `Ended ${endLabel}`, long: `${month.label} ended ${endLabel}.` }
  if (days === 0)
    return { isOpen: true, short: "Last day", long: `Today, ${endLabel}, is the last day of ${month.label}.` }
  return { isOpen: true, short: `${days} days left`, long: `${days} days left in ${month.label}.` }
}

/** The whole month in one figure: what's left of the plan, then budgeted / spent / time left. */
export function BudgetSummary({
  month,
  budgets,
  className,
}: {
  month: BudgetMonth
  /** limits may be the live draft while editing */
  budgets: Budget[]
  className?: string
}) {
  const { budgeted, spent, left, used } = totalsOf(budgets)
  const status = monthStatus(month)
  const isOver = left < 0
  const headline = isOver ? "Over budget" : status.isOpen ? "Left to spend" : "Left unspent"

  const facts = [
    { label: "Budgeted", value: formatBalance(budgeted) },
    { label: "Spent in budgets", value: formatBalance(spent) },
    { label: status.isOpen ? "Time left" : "Status", value: status.short },
  ]

  return (
    <SectionCard id="budget-summary" title={`${month.label} ${month.year}`} delay={0} className={className}>
      <div className="flex flex-col gap-2.5 px-4 pb-5">
        <p className="text-sm font-medium tracking-label text-fg-muted">{headline}</p>
        <p
          className={cn(
            "font-mono text-xl font-semibold tabular-nums sm:text-2xl",
            isOver ? "text-negative" : "text-fg-numeric"
          )}
        >
          {formatBalance(Math.abs(left))}
        </p>
        <Meter
          value={used}
          tone={isOver ? "negative" : "accent"}
          label={`${month.label} spending against budget`}
          className="mt-1.5"
        />
        <p className="text-xs leading-[1.4] font-medium text-fg-muted tabular-nums">
          {Math.round(used * 100)}% of {formatBalance(budgeted)} budgeted
        </p>
      </div>

      <dl className="mt-auto grid border-t border-line sm:grid-cols-3">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="flex h-[45px] items-center justify-between gap-3 border-b border-line px-4 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0"
          >
            <dt className="truncate text-sm font-medium text-fg-muted">{fact.label}</dt>
            <dd className="shrink-0 text-sm font-medium text-fg tabular-nums">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </SectionCard>
  )
}
