import { ColumnChart } from "@/components/analytics/column-chart"
import { SectionCard } from "@/components/dashboard/section-card"
import { WEEKDAY_SPEND } from "@/lib/data/analytics"

const columns = WEEKDAY_SPEND.map((d) => ({ key: d.day, label: d.day, name: d.label, value: d.amount }))
const busiest = columns.reduce((top, c, i) => (c.value > columns[top].value ? i : top), 0)

/** Everyday spend per weekday (rent excluded); the busiest day is the accent column. */
export function WeekdayCard({ className }: { className?: string }) {
  return (
    <SectionCard id="weekday-spend" title="Spending by day of week" delay={200} className={className}>
      <div className="flex flex-col gap-4 px-4 pb-5">
        <p className="text-sm font-medium tracking-label text-fg-muted">Everyday spending, rent excluded</p>
        <ColumnChart
          columns={columns}
          highlight={busiest}
          label="Everyday spending by day of week, January to September 2026"
          height={140}
        />
      </div>
    </SectionCard>
  )
}
