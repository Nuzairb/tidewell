import { SectionCard } from "@/components/dashboard/section-card"
import { Meter } from "@/components/ui/meter"
import { BUDGETS, MONTH_INCOME, TODAY } from "@/lib/data"
import { MONTHLY_CASHFLOW } from "@/lib/data/cashflow"
import { formatBalance, formatSignedUsd } from "@/lib/format"
import { cn } from "@/lib/utils"

// All spending counts toward the month; the meter only covers budgeted categories
const spent = MONTHLY_CASHFLOW.at(-1)!.expenses
const budgetedSpent = BUDGETS.reduce((sum, b) => sum + b.spent, 0)
const unbudgeted = spent - budgetedSpent
const budget = BUDGETS.reduce((sum, b) => sum + b.limit, 0)
const saved = MONTH_INCOME - spent
const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(TODAY)

/** The current month in one glance: spend against budget, then in / out / kept. */
export function MonthCard({ className }: { className?: string }) {
  const used = budgetedSpent / budget
  const rows = [
    { label: "Income", value: formatSignedUsd(MONTH_INCOME), className: "text-positive" },
    { label: "Spent", value: formatSignedUsd(-spent), className: "text-fg" },
    { label: "Saved", value: formatBalance(saved), className: "text-fg-numeric font-semibold" },
    { label: "Savings rate", value: `${Math.round((saved / MONTH_INCOME) * 100)}%`, className: "text-fg" },
  ]

  return (
    <SectionCard id="month" title={month} delay={40} className={className}>
      <div className="flex flex-col gap-2.5 px-4 pb-5">
        <p className="text-sm font-medium tracking-label text-fg-muted">Spent so far</p>
        <p className="font-mono text-xl font-semibold text-fg-numeric tabular-nums sm:text-2xl">
          {formatBalance(spent)}
        </p>
        <Meter value={used} label={`${month} spending against budget`} className="mt-1.5" />
        <p className="text-xs font-medium text-fg-muted tabular-nums">
          {Math.round(used * 100)}% of {formatBalance(budget)} budget used
          {unbudgeted > 0 && ` · ${formatBalance(unbudgeted)} unbudgeted`}
        </p>
      </div>

      <dl className="mt-auto flex flex-col border-t border-line">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex h-[45px] items-center justify-between gap-3 border-b border-line px-4 last:border-b-0"
          >
            <dt className="text-sm font-medium text-fg-muted">{row.label}</dt>
            <dd className={cn("text-sm font-medium tabular-nums", row.className)}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </SectionCard>
  )
}
