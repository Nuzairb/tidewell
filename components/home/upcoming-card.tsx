import { CardAction } from "@/components/dashboard/card-action"
import { SectionCard } from "@/components/dashboard/section-card"
import { TODAY, UPCOMING, type Bill } from "@/lib/data"
import { formatSignedUsd, parseIsoDate } from "@/lib/format"
import { cn } from "@/lib/utils"

const DAY_MS = 86_400_000
const monthShort = new Intl.DateTimeFormat("en-US", { month: "short" })
const monthLong = new Intl.DateTimeFormat("en-US", { month: "long" })

const total = UPCOMING.reduce((sum, b) => sum + b.amount, 0)
const nextMonth = monthLong.format(parseIsoDate(UPCOMING[0].date))

function dueIn(date: Date) {
  const days = Math.round((date.getTime() - TODAY.getTime()) / DAY_MS)
  if (days === 0) return "Today"
  if (days === 1) return "Tomorrow"
  return `In ${days} days`
}

/** Recurring charges coming up, soonest first, with the month's total. */
export function UpcomingCard({ className }: { className?: string }) {
  return (
    <SectionCard
      id="upcoming"
      title="Upcoming"
      action={<CardAction label="View all" href="/recurring" />}
      delay={120}
      className={className}
    >
      <ul className="flex flex-col border-t border-line">
        {UPCOMING.map((bill) => (
          <BillRow key={bill.id} bill={bill} />
        ))}
      </ul>
      <div className="mt-auto flex h-[45px] items-center justify-between gap-3 border-t border-line bg-sunken px-4">
        <span className="text-sm font-medium text-fg-muted">Due in {nextMonth}</span>
        <span className="text-sm font-semibold text-fg-numeric tabular-nums">{formatSignedUsd(total)}</span>
      </div>
    </SectionCard>
  )
}

function BillRow({ bill }: { bill: Bill }) {
  const { name, method, amount, estimated } = bill
  const date = parseIsoDate(bill.date)
  return (
    <li className="flex h-[60px] items-center gap-3 border-b border-line px-4 last:border-b-0">
      <span
        aria-hidden
        className="flex size-9 shrink-0 flex-col items-center justify-center gap-0.5 rounded-md bg-surface shadow-control"
      >
        <span className="text-sm leading-none font-semibold text-fg tabular-nums">{date.getDate()}</span>
        <span className="text-xs leading-none font-medium text-fg-muted">{monthShort.format(date)}</span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="truncate text-sm font-medium text-fg">{name}</span>
        <span className="truncate text-xs font-medium text-fg-muted">
          {dueIn(date)} · {method}
        </span>
      </span>
      <span className={cn("shrink-0 text-sm font-medium tabular-nums", amount > 0 ? "text-positive" : "text-fg")}>
        {estimated && <span className="text-fg-muted">est. </span>}
        {formatSignedUsd(amount)}
      </span>
    </li>
  )
}
