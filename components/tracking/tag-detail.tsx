import { AccountTile } from "@/components/accounts/account-summary"
import { CardAction } from "@/components/dashboard/card-action"
import { SectionCard } from "@/components/dashboard/section-card"
import { tagPeriod, type TagSummary } from "@/components/tracking/tag-stats"
import { Meter } from "@/components/ui/meter"
import { BUDGET_WARNING } from "@/lib/data"
import { formatBalance, formatDate, formatSignedUsd, formatUsd, formatUsdWhole, parseIsoDate } from "@/lib/format"
import { cn } from "@/lib/utils"

type Fact = { label: string; value: string; className?: string }

/** The selected tag: headline figure, budget meter, key facts. */
export function TagDetail({ tag, className }: { tag: TagSummary; className?: string }) {
  const { name, initials, note, spent, income, net, count, expenseCount, budget, used, start, end } = tag
  const earns = income > 0

  const facts: Fact[] = [
    { label: "Transactions", value: String(count) },
    { label: "Started", value: formatDate(parseIsoDate(start)) },
    ...(earns
      ? [
          { label: "Income", value: formatSignedUsd(income), className: "text-positive" },
          { label: "Costs", value: formatSignedUsd(-spent) },
        ]
      : [
          { label: "Average spend", value: expenseCount ? formatUsd(spent / expenseCount) : "—" },
          { label: "Ends", value: end ? formatDate(parseIsoDate(end)) : "Ongoing" },
        ]),
  ]

  return (
    <SectionCard
      id="tag-detail"
      title={name}
      action={<CardAction label="Edit tag" feature="Editing tags" />}
      delay={200}
      className={className}
    >
      <div className="flex flex-col gap-5 px-4 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-2.5">
            <p className="text-sm font-medium tracking-label text-fg-muted">{earns ? "Profit" : "Spent so far"}</p>
            <p className="font-mono text-xl font-semibold text-fg-numeric tabular-nums sm:text-2xl">
              {formatBalance(earns ? net : spent)}
            </p>
            <p className="text-sm font-medium tracking-label">
              {earns ? (
                <>
                  <span className="text-positive">{formatSignedUsd(income)} </span>
                  <span className="text-fg-muted">in, {formatUsd(spent)} in costs</span>
                </>
              ) : budget ? (
                <span className="text-fg-muted">
                  {formatUsd(Math.max(budget - spent, 0))} left of {formatUsdWhole(budget)}
                </span>
              ) : (
                <span className="text-fg-muted">No budget set</span>
              )}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="hidden flex-col items-end gap-1.5 sm:flex">
              <span className="text-sm font-medium text-fg">{tagPeriod(tag)}</span>
              <span className="text-xs font-medium text-fg-muted">{end ? "Fixed dates" : "Ongoing"}</span>
            </span>
            <AccountTile initials={initials} />
          </div>
        </div>

        {budget !== undefined && used !== undefined && (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-fg">Budget used</span>
              <span className="text-sm font-medium text-fg-muted tabular-nums">
                <span className={used >= BUDGET_WARNING ? "text-negative" : "text-fg"}>{Math.round(used * 100)}%</span>{" "}
                of {formatUsdWhole(budget)}
              </span>
            </div>
            <Meter value={used} tone={used >= BUDGET_WARNING ? "negative" : "accent"} label={`${name} budget used`} />
          </div>
        )}

        <p className="text-sm leading-[1.4] font-medium text-fg-muted">{note}</p>
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
            <dd className={cn("shrink-0 text-sm font-medium text-fg tabular-nums", fact.className)}>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </SectionCard>
  )
}
