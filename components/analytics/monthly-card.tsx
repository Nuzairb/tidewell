import { MONTH_AVERAGE } from "@/components/analytics/analytics-stats"
import { ColumnChart } from "@/components/analytics/column-chart"
import { CardAction } from "@/components/dashboard/card-action"
import { SectionCard } from "@/components/dashboard/section-card"
import { MONTHLY_SPEND } from "@/lib/data/analytics"
import { formatUsdWhole } from "@/lib/format"

const columns = MONTHLY_SPEND.map((m) => ({ key: m.month, label: m.month, name: m.label, value: m.amount }))

/** Month-over-month spend, Jan → Sep; the current month is the accent column. */
export function MonthlyCard({ className }: { className?: string }) {
  return (
    <SectionCard
      id="monthly-spend"
      title="Spending by month"
      action={<CardAction label="Cashflow" href="/cashflow" />}
      delay={160}
      className={className}
    >
      <div className="flex flex-col gap-4 px-4 pb-5">
        <p className="flex items-center gap-2.5 text-sm font-medium tracking-label text-fg-muted">
          <span aria-hidden className="w-4 border-t border-dashed border-fg-muted" />
          <span>
            Monthly average <span className="text-fg tabular-nums">{formatUsdWhole(MONTH_AVERAGE)}</span>
          </span>
        </p>
        <ColumnChart
          columns={columns}
          highlight={columns.length - 1}
          average={MONTH_AVERAGE}
          label="Spending per month, January to September 2026"
          height={200}
        />
      </div>
    </SectionCard>
  )
}
