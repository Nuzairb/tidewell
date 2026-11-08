"use client"

import { useMemo, useState } from "react"
import { PageContent } from "@/components/dashboard/app-shell"
import { PageHeader } from "@/components/dashboard/page-header"
import { ChargeCalendar } from "@/components/recurring/charge-calendar"
import { accountLabel } from "@/components/recurring/recurring-math"
import { RecurringList } from "@/components/recurring/recurring-list"
import { RecurringSummary } from "@/components/recurring/recurring-summary"
import { UPCOMING } from "@/lib/data"
import { RECURRING } from "@/lib/data/recurring"
import { parseIsoDate } from "@/lib/format"

// The calendar shows the month UPCOMING covers (October, the month after TODAY)
const calendarStart = parseIsoDate(UPCOMING[0].date)
const CAL_YEAR = calendarStart.getFullYear()
const CAL_MONTH = calendarStart.getMonth()

const isoDay = (day: number) =>
  `${CAL_YEAR}-${String(CAL_MONTH + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

/** Recurring — every bill, subscription and paycheck that repeats, and when it next lands. */
export function RecurringView() {
  const [query, setQuery] = useState("")
  const [selectedDay, setSelectedDay] = useState<number>()
  const [reminders, setReminders] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(RECURRING.map((s) => [s.id, Boolean(s.remind)]))
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return RECURRING
    return RECURRING.filter((s) =>
      [s.name, s.category, s.method, accountLabel(s.account)].some((v) => v.toLowerCase().includes(q))
    )
  }, [query])

  return (
    <>
      <PageHeader
        searchLabel="Search recurring payments"
        title="Recurring"
        subtitle="Bills, subscriptions and income that repeat."
        query={query}
        onQueryChange={setQuery}
      />
      <PageContent>
        <RecurringSummary />
        <div className="grid items-start gap-3 sm:gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <ChargeCalendar
            year={CAL_YEAR}
            month={CAL_MONTH}
            series={RECURRING}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />
          <RecurringList
            series={filtered}
            query={query}
            highlightDate={selectedDay ? isoDay(selectedDay) : undefined}
            reminders={reminders}
            onRemindChange={(id, on) => setReminders((r) => ({ ...r, [id]: on }))}
          />
        </div>
      </PageContent>
    </>
  )
}
