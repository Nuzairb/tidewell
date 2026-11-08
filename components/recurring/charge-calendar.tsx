"use client"

import { SectionCard } from "@/components/dashboard/section-card"
import { Button } from "@/components/ui/button"
import type { RecurringSeries } from "@/lib/data/recurring"
import { formatSignedUsd, parseIsoDate } from "@/lib/format"
import { cn } from "@/lib/utils"

const WEEKDAYS = [
  { short: "S", long: "Sunday" },
  { short: "M", long: "Monday" },
  { short: "T", long: "Tuesday" },
  { short: "W", long: "Wednesday" },
  { short: "T", long: "Thursday" },
  { short: "F", long: "Friday" },
  { short: "S", long: "Saturday" },
]

/**
 * One month as a 7-column grid. Days with something due are buttons; picking
 * one highlights its items in the list.
 */
export function ChargeCalendar({
  year,
  month,
  series,
  selectedDay,
  onSelectDay,
  className,
}: {
  year: number
  /** 0-based */
  month: number
  series: RecurringSeries[]
  selectedDay?: number
  onSelectDay: (day?: number) => void
  className?: string
}) {
  const first = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(first)
  const monthShort = new Intl.DateTimeFormat("en-US", { month: "short" }).format(first)

  const byDay = new Map<number, RecurringSeries[]>()
  for (const s of series) {
    const date = parseIsoDate(s.next)
    if (date.getFullYear() !== year || date.getMonth() !== month) continue
    byDay.set(date.getDate(), [...(byDay.get(date.getDate()) ?? []), s])
  }

  const charges = [...byDay.values()].flat().filter((s) => s.amount < 0)
  const chargesTotal = charges.reduce((sum, s) => sum + s.amount, 0)
  const selected = selectedDay ? (byDay.get(selectedDay) ?? []) : []
  const selectedTotal = selected.reduce((sum, s) => sum + s.amount, 0)

  return (
    <SectionCard
      id="charge-calendar"
      title={`${monthName} ${year}`}
      action={
        selectedDay ? (
          <Button className="rounded-md" onClick={() => onSelectDay(undefined)}>
            <span className="px-[2px] leading-none font-medium">Show all</span>
          </Button>
        ) : undefined
      }
      delay={160}
      className={className}
    >
      <div className="flex flex-col gap-3 px-4 pb-4">
        <div role="group" aria-label={`${monthName} ${year}, days with recurring items`} className="flex flex-col gap-1">
          <div aria-hidden className="grid grid-cols-7 gap-1">
            {WEEKDAYS.map((d) => (
              <span key={d.long} title={d.long} className="py-1 text-center text-xs font-medium text-fg-subtle">
                {d.short}
              </span>
            ))}
          </div>
          {weeks(first.getDay(), daysInMonth).map((week, w) => (
            <div key={w} className="grid grid-cols-7 gap-1">
              {week.map((day, i) => (
                <div key={i}>
                  {day !== undefined && (
                    <Day
                      day={day}
                      label={`${monthShort} ${day}`}
                      items={byDay.get(day) ?? []}
                      selected={day === selectedDay}
                      onSelect={() => onSelectDay(day === selectedDay ? undefined : day)}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-fg-muted">
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="size-1.5 rounded-pill bg-accent-solid" />
            Income
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="size-1.5 rounded-pill bg-icon" />
            Charge
          </span>
        </div>
      </div>

      <div
        role="status"
        className="mt-auto flex h-[45px] items-center justify-between gap-3 border-t border-line bg-sunken px-4"
      >
        <span className="truncate text-sm font-medium text-fg-muted">
          {selectedDay ? `${monthShort} ${selectedDay} · ${selected.map((s) => s.name).join(", ")}` : `Charges in ${monthName}`}
        </span>
        <span
          className={cn(
            "shrink-0 text-sm font-semibold tabular-nums",
            selectedDay && selectedTotal > 0 ? "text-positive" : "text-fg-numeric"
          )}
        >
          {formatSignedUsd(selectedDay ? selectedTotal : chargesTotal)}
        </span>
      </div>
    </SectionCard>
  )
}

function Day({
  day,
  label,
  items,
  selected,
  onSelect,
}: {
  day: number
  label: string
  items: RecurringSeries[]
  selected: boolean
  onSelect: () => void
}) {
  const base = "flex h-11 w-full flex-col items-center justify-center gap-1 rounded-md text-sm leading-none tabular-nums"
  if (!items.length) return <span className={cn(base, "font-medium text-fg-muted")}>{day}</span>

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`${label}: ${items.map((s) => `${s.name} ${formatSignedUsd(s.amount)}`).join(", ")}`}
      onClick={onSelect}
      className={cn(
        base,
        "cursor-pointer font-semibold outline-none",
        "transition-[background-color,box-shadow,color] duration-(--duration-press) ease-out-strong",
        "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-(--ring-focus)",
        selected
          ? "bg-accent-soft text-fg-accent"
          : "bg-surface text-fg shadow-control [@media(hover:hover)]:hover:bg-hover"
      )}
    >
      {day}
      <span aria-hidden className="flex gap-0.5">
        {items.map((s) => (
          <span key={s.id} className={cn("size-1 rounded-pill", s.amount > 0 ? "bg-accent-solid" : "bg-icon")} />
        ))}
      </span>
    </button>
  )
}

/** Day numbers in Sunday-first weeks, padded with blanks. */
function weeks(leading: number, days: number): (number | undefined)[][] {
  const cells = [
    ...Array.from({ length: leading }, () => undefined),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ]
  while (cells.length % 7) cells.push(undefined)
  return Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7))
}
