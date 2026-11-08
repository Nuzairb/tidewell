import { CardAction } from "@/components/dashboard/card-action"
import { SectionCard } from "@/components/dashboard/section-card"
import { Meter } from "@/components/ui/meter"
import { GOALS } from "@/lib/data"
import { formatUsdWhole } from "@/lib/format"

/** Savings goals: how far along, how much is left, by when. */
export function GoalsCard({ className }: { className?: string }) {
  return (
    <SectionCard
      id="goals"
      title="Goals"
      action={<CardAction label="View all" href="/goals" />}
      delay={160}
      className={className}
    >
      <ul className="flex flex-col border-t border-line">
        {GOALS.map(({ id, name, saved, target, due }) => {
          const progress = saved / target
          return (
            <li key={id} className="flex flex-col gap-2.5 border-b border-line px-4 py-4 last:border-b-0">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-sm font-medium text-fg">{name}</span>
                <span className="shrink-0 text-sm font-semibold text-fg-numeric tabular-nums">
                  {Math.round(progress * 100)}%
                </span>
              </div>
              <Meter value={progress} label={`${name} progress`} />
              <div className="flex items-center justify-between gap-3 text-xs font-medium text-fg-muted tabular-nums">
                <span>
                  {formatUsdWhole(saved)} of {formatUsdWhole(target)}
                </span>
                <span>by {due}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </SectionCard>
  )
}
