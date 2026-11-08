"use client"

import { AccountTile } from "@/components/accounts/account-summary"
import { BalanceChart } from "@/components/accounts/balance-chart"
import { CardAction } from "@/components/dashboard/card-action"
import { SectionCard } from "@/components/dashboard/section-card"
import { ContributionSlider } from "@/components/goals/contribution-slider"
import { projectGoal } from "@/components/goals/goal-projection"
import { Meter } from "@/components/ui/meter"
import { ACCOUNTS } from "@/lib/data"
import type { GoalPlan } from "@/lib/data/goals"
import { formatBalance, formatUsdWhole } from "@/lib/format"
import { cn } from "@/lib/utils"

const SLIDER_STEP = 25
const SLIDER_CEILING = 2000

/** The selected goal: progress, saved-over-time, and a what-if on the monthly contribution. */
export function GoalDetail({
  goal,
  monthly,
  onMonthlyChange,
  className,
}: {
  goal: GoalPlan
  monthly: number
  onMonthlyChange: (value: number) => void
  className?: string
}) {
  const { name, saved, target, due, history, started } = goal
  const account = ACCOUNTS.find((a) => a.id === goal.account)
  const progress = saved / target
  const projection = projectGoal(goal, monthly)
  // past the remaining amount the finish date can't move, so the slider stops there
  const max = Math.min(Math.ceil((target - saved) / SLIDER_STEP) * SLIDER_STEP, SLIDER_CEILING)

  const facts = [
    { label: "Target date", value: due },
    { label: "Projected finish", value: projection.finish ?? "—" },
    { label: "Needed to finish on time", value: `${formatUsdWhole(projection.needed)}/mo` },
    { label: "Started", value: started },
  ]

  return (
    <SectionCard
      id="goal-detail"
      title={name}
      action={<CardAction label="Edit goal" feature="Editing goals" />}
      delay={200}
      className={className}
    >
      <div className="flex flex-col gap-5 px-4 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-2.5">
            <p className="text-sm font-medium tracking-label text-fg-muted">Saved so far</p>
            <p className="font-mono text-xl font-semibold text-fg-numeric tabular-nums sm:text-2xl">
              {formatBalance(saved)}
            </p>
            <p className="text-sm font-medium tracking-label text-fg-muted tabular-nums">
              <span className="text-fg">{Math.round(progress * 100)}%</span> of {formatUsdWhole(target)}
            </p>
          </div>
          {account && (
            <div className="flex shrink-0 items-center gap-2.5">
              <span className="hidden flex-col items-end gap-1.5 sm:flex">
                <span className="text-sm font-medium text-fg">{account.name}</span>
                <span className="text-xs font-medium text-fg-muted">
                  {account.institution} ••{account.mask}
                </span>
              </span>
              <AccountTile initials={account.initials} />
            </div>
          )}
        </div>

        <Meter
          value={progress}
          tone={projection.onTrack ? "accent" : "negative"}
          label={`${name} progress`}
        />

        <BalanceChart values={history} label={`${name} saved`} />

        <div className="flex flex-col gap-2.5 border-t border-line pt-4">
          <ContributionSlider
            value={monthly}
            planned={goal.monthly}
            max={Math.max(max, goal.monthly)}
            onChange={onMonthlyChange}
          />
          <p aria-live="polite" className="text-sm leading-[1.4] font-medium text-fg-muted">
            <span className={cn("font-semibold", projection.onTrack ? "text-fg" : "text-negative")}>
              {projection.onTrack ? "On track. " : "Behind. "}
            </span>
            {projection.sentence}
          </p>
        </div>
      </div>

      <dl className="mt-auto grid border-t border-line sm:grid-cols-2">
        {facts.map((fact, i) => (
          <div
            key={fact.label}
            className={cn(
              "flex h-[45px] items-center justify-between gap-3 border-b border-line px-4",
              "sm:odd:border-r sm:[&:nth-last-child(-n+2)]:border-b-0",
              i === facts.length - 1 && "border-b-0"
            )}
          >
            <dt className="truncate text-sm font-medium text-fg-muted">{fact.label}</dt>
            <dd className="shrink-0 text-sm font-medium text-fg tabular-nums">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </SectionCard>
  )
}
