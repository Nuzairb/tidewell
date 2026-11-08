import { CardAction } from "@/components/dashboard/card-action"
import { SectionCard } from "@/components/dashboard/section-card"
import { Meter } from "@/components/ui/meter"
import { BUDGET_WARNING, BUDGETS } from "@/lib/data"
import { formatBalance, formatUsdWhole } from "@/lib/format"
import { cn } from "@/lib/utils"

const VISIBLE = 5

/** Closest-to-limit first, so the categories that need attention lead. */
const rows = BUDGETS.filter((b) => !b.fixed)
  .map((b) => ({ ...b, used: b.spent / b.limit }))
  .sort((a, b) => b.used - a.used)
  .slice(0, VISIBLE)

export function BudgetsCard({ className }: { className?: string }) {
  return (
    <SectionCard
      id="budgets"
      title="Budgets"
      action={<CardAction label="View all" href="/budget" />}
      delay={80}
      className={className}
    >
      <ul className="flex flex-col border-t border-line">
        {rows.map(({ id, category, spent, limit, used }) => {
          const warn = used >= BUDGET_WARNING
          return (
            <li key={id} className="flex flex-col gap-2.5 border-b border-line px-4 py-3.5 last:border-b-0">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-sm font-medium text-fg">{category}</span>
                <span className="shrink-0 text-sm font-medium text-fg-muted tabular-nums">
                  <span className={cn(warn ? "text-negative" : "text-fg")}>{formatBalance(spent)}</span> /{" "}
                  {formatUsdWhole(limit)}
                </span>
              </div>
              <Meter value={used} tone={warn ? "negative" : "accent"} label={`${category} budget used`} />
            </li>
          )
        })}
      </ul>
    </SectionCard>
  )
}
