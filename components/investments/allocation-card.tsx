import { CardAction } from "@/components/dashboard/card-action"
import { SectionCard } from "@/components/dashboard/section-card"
import { FundChip, fundColor } from "@/components/investments/fund-chip"
import { HOLDING_ROWS, formatShare } from "@/components/investments/portfolio"
import { cn } from "@/lib/utils"

/** Drift (in percentage points) past which a fund is worth rebalancing. */
const DRIFT_WARNING = 5

/** Actual mix against the plan: two stacked bars, then one row per fund with its drift. */
export function AllocationCard({ className }: { className?: string }) {
  return (
    <SectionCard
      id="allocation"
      title="Allocation"
      action={<CardAction label="Rebalance" feature="Rebalancing" />}
      delay={160}
      className={className}
    >
      <div className="flex flex-col gap-4 px-4 pb-5">
        <StackedBar label="Actual" shares={HOLDING_ROWS.map((h) => h.weight)} />
        <StackedBar label="Target" shares={HOLDING_ROWS.map((h) => h.target)} />
      </div>

      <div className="flex h-9 items-center justify-between gap-3 border-y border-line bg-sunken px-4 text-sm font-medium text-fg-subtle">
        <span>Fund</span>
        <span>Actual · Target</span>
      </div>
      <ul className="mt-auto flex flex-col">
        {HOLDING_ROWS.map((h) => {
          const drift = (h.weight - h.target) * 100
          return (
            <li
              key={h.ticker}
              className="flex h-[60px] items-center gap-3 border-b border-line px-4 last:border-b-0"
            >
              <FundChip index={h.index} />
              <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="truncate text-sm font-medium text-fg">{h.ticker}</span>
                <span className="truncate text-xs font-medium text-fg-muted">{h.assetClass}</span>
              </span>
              <span className="flex shrink-0 flex-col items-end gap-1.5 tabular-nums">
                <span className="text-sm font-medium text-fg-muted">
                  <span className="text-fg">{formatShare(h.weight)}</span> · {formatShare(h.target)}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    Math.abs(drift) >= DRIFT_WARNING ? "text-negative" : "text-fg-muted"
                  )}
                >
                  {drift >= 0 ? "+" : "−"}
                  {Math.abs(drift).toFixed(1)} pts
                </span>
              </span>
            </li>
          )
        })}
      </ul>
    </SectionCard>
  )
}

function StackedBar({ label, shares }: { label: string; shares: number[] }) {
  const description = HOLDING_ROWS.map((h, i) => `${h.ticker} ${formatShare(shares[i])}`).join(", ")
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-sm font-medium text-fg-muted">{label}</span>
      <div role="img" aria-label={`${label} allocation: ${description}`} className="flex h-2.5 w-full gap-0.5">
        {shares.map((share, i) => (
          <span
            key={HOLDING_ROWS[i].ticker}
            className="h-full first:rounded-l-pill last:rounded-r-pill"
            style={{ width: `${share * 100}%`, background: fundColor(i) }}
          />
        ))}
      </div>
    </div>
  )
}
