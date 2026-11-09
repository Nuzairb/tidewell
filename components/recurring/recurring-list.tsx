"use client"

import { accountLabel, dueIn, sumPerMonth } from "@/components/recurring/recurring-math"
import { Switch } from "@/components/ui/switch"
import { RECURRING_GROUPS, type RecurringSeries } from "@/lib/data/recurring"
import { formatDate, formatSignedUsd, parseIsoDate } from "@/lib/format"
import { cn } from "@/lib/utils"

const monthShort = new Intl.DateTimeFormat("en-US", { month: "short" })
const FREQUENCY = { monthly: "Monthly", yearly: "Yearly" } as const

/** Income, Bills, Subscriptions — each with a per-month subtotal and a reminder switch per item. */
export function RecurringList({
  series,
  query,
  highlightDate,
  reminders,
  onRemindChange,
  className,
}: {
  series: RecurringSeries[]
  query: string
  /** ISO date picked in the calendar */
  highlightDate?: string
  reminders: Record<string, boolean>
  onRemindChange: (id: string, on: boolean) => void
  className?: string
}) {
  const groups = RECURRING_GROUPS.map((g) => {
    const items = series.filter((s) => s.kind === g.id).sort((a, b) => a.next.localeCompare(b.next))
    return { ...g, items, total: sumPerMonth(items) }
  }).filter((g) => g.items.length > 0)

  return (
    <section
      aria-labelledby="recurring-list-title"
      className={cn("sn-enter flex min-w-0 flex-col overflow-hidden rounded-card bg-surface shadow-card", className)}
      style={{ animationDelay: "200ms" }}
    >
      <div className="flex h-[62px] shrink-0 items-center justify-between gap-3 p-4">
        <h2
          id="recurring-list-title"
          className="flex min-w-0 items-baseline gap-2 text-base leading-[22px] font-semibold text-fg"
        >
          <span className="whitespace-nowrap">All recurring</span>
          {query && (
            <span className="truncate text-sm font-medium text-fg-muted">
              · {series.length} match{series.length === 1 ? "" : "es"}
            </span>
          )}
        </h2>
        <span className="shrink-0 text-xs font-medium text-fg-muted">Remind me</span>
      </div>

      {groups.length === 0 && (
        <p className="border-t border-line px-4 py-10 text-center text-sm font-medium text-fg-muted">
          Nothing recurring matches “{query}”.
        </p>
      )}

      {groups.map((group) => (
        <div key={group.id} role="group" aria-labelledby={`recurring-${group.id}`}>
          <div className="flex h-9 items-center justify-between gap-3 border-y border-line bg-sunken px-4">
            <span id={`recurring-${group.id}`} className="text-sm font-medium text-fg-subtle">
              {group.label}
            </span>
            <span
              className={cn(
                "text-sm font-medium tabular-nums",
                group.total > 0 ? "text-positive" : "text-fg-muted"
              )}
            >
              {formatSignedUsd(group.total)}
              <span className="text-fg-muted"> / mo</span>
            </span>
          </div>
          <ul className="flex flex-col">
            {group.items.map((item) => (
              <SeriesRow
                key={item.id}
                item={item}
                highlighted={item.next === highlightDate}
                remind={reminders[item.id] ?? false}
                onRemindChange={(on) => onRemindChange(item.id, on)}
              />
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}

function SeriesRow({
  item,
  highlighted,
  remind,
  onRemindChange,
}: {
  item: RecurringSeries
  highlighted: boolean
  remind: boolean
  onRemindChange: (on: boolean) => void
}) {
  const { name, frequency, amount, estimated, account } = item
  const date = parseIsoDate(item.next)
  const when = frequency === "yearly" ? `Next ${formatDate(date)}` : dueIn(item.next)

  return (
    <li
      className={cn(
        "flex h-[60px] items-center gap-3 border-b border-line px-4 transition-colors duration-(--duration-press) last:border-b-0",
        highlighted ? "bg-nav-active" : "[@media(hover:hover)]:hover:bg-hover"
      )}
    >
      <span
        aria-hidden
        className="flex size-9 shrink-0 flex-col items-center justify-center gap-0.5 rounded-md bg-control shadow-control"
      >
        <span className="text-sm leading-none font-semibold text-fg tabular-nums">{date.getDate()}</span>
        <span className="text-xs leading-none font-medium text-fg-muted">{monthShort.format(date)}</span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="truncate text-sm font-medium text-fg">{name}</span>
        <span className="truncate text-xs font-medium text-fg-muted">
          {when}
          <span className="hidden sm:inline"> · {accountLabel(account)}</span>
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1.5">
        <span className={cn("text-sm font-medium tabular-nums", amount > 0 ? "text-positive" : "text-fg")}>
          {estimated && <span className="text-fg-muted">est. </span>}
          {formatSignedUsd(amount)}
        </span>
        <span className="text-xs font-medium text-fg-muted">{FREQUENCY[frequency]}</span>
      </span>
      <Switch
        checked={remind}
        onCheckedChange={(checked) => onRemindChange(checked)}
        aria-label={`Remind me before ${name}`}
        className="ml-1"
      />
    </li>
  )
}
