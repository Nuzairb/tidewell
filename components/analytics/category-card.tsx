import { TOTAL_SPENT } from "@/components/analytics/analytics-stats"
import { CardAction } from "@/components/dashboard/card-action"
import { SectionCard } from "@/components/dashboard/section-card"
import { Meter } from "@/components/ui/meter"
import { CATEGORY_SPEND } from "@/lib/data/analytics"
import { formatUsd } from "@/lib/format"

const rows = [...CATEGORY_SPEND]
  .sort((a, b) => b.amount - a.amount)
  .map((c) => ({ ...c, share: c.amount / TOTAL_SPENT }))

/** Every category's amount and share of the period; bars are drawn against the whole. */
export function CategoryCard({ className }: { className?: string }) {
  return (
    <SectionCard
      id="category-spend"
      title="Spending by category"
      action={<CardAction label="Budgets" href="/budget" />}
      delay={240}
      className={className}
    >
      <ul className="flex flex-col border-t border-line">
        {rows.map(({ category, amount, share }) => (
          <li key={category} className="flex flex-col gap-2.5 border-b border-line px-4 py-3 last:border-b-0">
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-sm font-medium text-fg">{category}</span>
              <span className="flex shrink-0 items-center gap-3 text-sm font-medium tabular-nums">
                <span className="text-fg">{formatUsd(amount)}</span>
                <span className="w-12 text-right text-fg-muted">{(share * 100).toFixed(1)}%</span>
              </span>
            </div>
            <Meter value={share} label={`${category} share of spending`} />
          </li>
        ))}
      </ul>
      <div className="mt-auto flex h-[45px] items-center justify-between gap-3 border-t border-line bg-sunken px-4">
        <span className="text-sm font-medium text-fg-muted">Total, Jan – Sep</span>
        <span className="text-sm font-semibold text-fg-numeric tabular-nums">{formatUsd(TOTAL_SPENT)}</span>
      </div>
    </SectionCard>
  )
}
