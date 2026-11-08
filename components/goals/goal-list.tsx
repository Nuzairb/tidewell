"use client"

import { CardAction } from "@/components/dashboard/card-action"
import { SectionCard } from "@/components/dashboard/section-card"
import type { Projection } from "@/components/goals/goal-projection"
import { Meter } from "@/components/ui/meter"
import type { GoalPlan } from "@/lib/data/goals"
import { formatUsdWhole } from "@/lib/format"
import { cn } from "@/lib/utils"

export type GoalRow = { goal: GoalPlan; projection: Projection }

/** Every goal with its progress and projection. Rows select the detail panel. */
export function GoalList({
  rows,
  query,
  selectedId,
  onSelect,
  className,
}: {
  rows: GoalRow[]
  query: string
  selectedId: string
  onSelect: (id: string) => void
  className?: string
}) {
  return (
    <SectionCard
      id="goal-list"
      title="All goals"
      action={<CardAction label="New goal" feature="New goals" />}
      delay={160}
      className={className}
    >
      {rows.length === 0 ? (
        <p className="border-t border-line px-4 py-10 text-center text-sm font-medium text-fg-muted">
          No goals match “{query}”.
        </p>
      ) : (
        <ul className="flex flex-col border-t border-line">
          {rows.map(({ goal, projection }) => {
            const selected = goal.id === selectedId
            return (
              <li key={goal.id} className="border-b border-line last:border-b-0">
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelect(goal.id)}
                  className={cn(
                    "flex w-full cursor-pointer flex-col gap-2.5 px-4 py-4 text-left outline-none",
                    "transition-colors duration-(--duration-press) ease-out-strong",
                    "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--ring-focus)",
                    selected ? "bg-nav-active" : "[@media(hover:hover)]:hover:bg-hover"
                  )}
                >
                  <GoalSummary goal={goal} projection={projection} />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </SectionCard>
  )
}

function GoalSummary({ goal, projection }: GoalRow) {
  const { name, saved, target, due } = goal
  const progress = saved / target
  return (
    <>
      <span className="flex w-full items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-medium text-fg">{name}</span>
          <span
            className={cn("shrink-0 text-xs font-medium", projection.onTrack ? "text-fg-muted" : "text-negative")}
          >
            · {projection.onTrack ? "On track" : "Behind"}
          </span>
        </span>
        <span className="shrink-0 text-sm font-semibold text-fg-numeric tabular-nums">
          {Math.round(progress * 100)}%
        </span>
      </span>
      <Meter
        value={progress}
        tone={projection.onTrack ? "accent" : "negative"}
        label={`${name} progress`}
      />
      <span className="flex w-full items-center justify-between gap-3 text-xs font-medium text-fg-muted tabular-nums">
        <span>
          {formatUsdWhole(saved)} of {formatUsdWhole(target)}
        </span>
        <span>by {due}</span>
      </span>
      <span className="text-xs leading-[1.4] font-medium text-fg-muted">{projection.sentence}</span>
    </>
  )
}
