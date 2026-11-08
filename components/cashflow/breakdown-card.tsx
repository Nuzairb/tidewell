import type { ReactNode } from "react"
import { SectionCard } from "@/components/dashboard/section-card"
import { Meter } from "@/components/ui/meter"
import type { CashflowShare } from "@/lib/data/cashflow"
import { formatSignedUsd } from "@/lib/format"
import { cn } from "@/lib/utils"

/**
 * One line per income source or spending category for the period: amount,
 * share of the period total and a share meter. Shares stay relative to the
 * full total while searching, so a filtered row reads the same as before.
 */
export function BreakdownCard({
  id,
  title,
  rows,
  total,
  sign,
  query,
  action,
  delay,
  className,
}: {
  id: string
  title: string
  rows: CashflowShare[]
  total: number
  /** income is shown "+$", spending "−$" */
  sign: 1 | -1
  query: string
  action?: ReactNode
  delay: number
  className?: string
}) {
  const income = sign > 0

  return (
    <SectionCard id={id} title={title} action={action} delay={delay} className={className}>
      <ul className="flex flex-1 flex-col border-t border-line">
        {rows.length === 0 ? (
          <li className="px-4 py-10 text-center text-sm font-medium text-fg-muted">
            Nothing matches “{query}”.
          </li>
        ) : (
          rows.map((row) => {
            const pct = `${(row.share * 100).toFixed(1)}%`
            return (
              <li key={row.id} className="flex flex-col gap-2.5 border-b border-line px-4 py-3.5 last:border-b-0">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-medium text-fg">{row.name}</span>
                  <span className="flex shrink-0 items-center gap-2 text-sm font-medium tabular-nums">
                    <span className={income ? "text-positive" : "text-fg"}>{formatSignedUsd(sign * row.amount)}</span>
                    <span className="w-12 text-right text-fg-muted">{pct}</span>
                  </span>
                </div>
                <Meter value={row.share} label={`${row.name}, ${pct} of ${income ? "income" : "spending"}`} />
              </li>
            )
          })
        )}
      </ul>
      <div className="flex h-[45px] shrink-0 items-center justify-between gap-3 border-t border-line bg-sunken px-4">
        <span className="text-sm font-medium text-fg-muted">Total, Jan – Sep</span>
        <span className={cn("text-sm font-semibold tabular-nums", income ? "text-positive" : "text-fg-numeric")}>
          {formatSignedUsd(sign * total)}
        </span>
      </div>
    </SectionCard>
  )
}
