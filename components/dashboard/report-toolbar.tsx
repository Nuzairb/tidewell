"use client"

import { useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { RangeCalendar, type DateRangeValue } from "@/components/ui/range-calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DEFAULT_RANGE, type Transaction } from "@/lib/data"
import { formatDate } from "@/lib/format"
import { BREAKPOINTS, useMediaQuery } from "@/lib/use-media-query"

export type Range = { from: Date; to: Date }

const PRESETS: { label: string; range: Range }[] = [
  { label: "Year to date", range: DEFAULT_RANGE },
  { label: "Last 30 days", range: { from: new Date(2026, 7, 31), to: new Date(2026, 8, 30) } },
  { label: "Last 90 days", range: { from: new Date(2026, 6, 2), to: new Date(2026, 8, 30) } },
  { label: "September", range: { from: new Date(2026, 8, 1), to: new Date(2026, 8, 30) } },
  { label: "Q3 2026", range: { from: new Date(2026, 6, 1), to: new Date(2026, 8, 30) } },
]

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString()

/** Figma node 1:145 — date range control (left) + Download (right). */
export function ReportToolbar({
  range,
  onRangeChange,
  rows,
}: {
  range: Range
  onRangeChange: (r: Range) => void
  rows: Transaction[]
}) {
  return (
    <div className="flex w-full items-center justify-between">
      <DateRangePicker range={range} onRangeChange={onRangeChange} />
      <Button onClick={() => downloadCsv(rows, range)} aria-label="Download report as CSV" className="max-sm:size-[30px]">
        <Icon name="download-01-alt" />
        <span className="hidden px-[2px] leading-none font-medium tracking-normal sm:inline">Download</span>
      </Button>
    </div>
  )
}

function DateRangePicker({ range, onRangeChange }: { range: Range; onRangeChange: (r: Range) => void }) {
  const isTablet = useMediaQuery(BREAKPOINTS.md)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<DateRangeValue | undefined>(range)

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (o) setDraft(range)
      }}
    >
      <PopoverTrigger
        render={<Button variant="raised" size="field" aria-label="Select date range" />}
      >
        <Icon name="calendar" />
        <span className="text-sm font-medium whitespace-nowrap text-fg-muted">{formatDate(range.from)}</span>
        <span className="text-sm font-medium text-fg-muted">-</span>
        <span className="text-sm font-medium whitespace-nowrap text-fg-muted">{formatDate(range.to)}</span>
        <Icon name="chevron-selector-vertical" />
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={8} collisionPadding={16} className="w-auto max-w-[calc(100vw-32px)] flex-col gap-0 p-0 md:flex-row">
        <ul className="flex gap-1 overflow-x-auto border-b border-line p-2 [scrollbar-width:none] md:w-36 md:flex-col md:gap-0.5 md:overflow-visible md:border-r md:border-b-0">
          {PRESETS.map((p) => {
            const active = sameDay(p.range.from, range.from) && sameDay(p.range.to, range.to)
            return (
              <li key={p.label}>
                <button
                  type="button"
                  onClick={() => {
                    onRangeChange(p.range)
                    setOpen(false)
                  }}
                  className={cn(
                    "flex h-[30px] w-full cursor-pointer items-center rounded-md px-2 text-left text-sm font-medium whitespace-nowrap",
                    "transition-colors duration-(--duration-press) ease-out-strong",
                    active
                      ? "bg-nav-active text-fg-accent"
                      : "text-fg-muted [@media(hover:hover)]:hover:bg-nav-hover [@media(hover:hover)]:hover:text-fg"
                  )}
                >
                  {p.label}
                </button>
              </li>
            )
          })}
        </ul>
        <div className="flex flex-col">
          <RangeCalendar
            numberOfMonths={isTablet ? 2 : 1}
            defaultMonth={new Date(2026, isTablet ? 7 : 8, 1)}
            startMonth={new Date(2026, 0, 1)}
            endMonth={new Date(2026, 11, 1)}
            value={draft}
            onChange={setDraft}
            className="flex justify-center p-3"
          />
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line p-3">
            <span className="text-xs font-medium text-fg-muted">
              {draft?.from ? formatDate(draft.from) : "Start"} – {draft?.to ? formatDate(draft.to) : "Pick an end date"}
            </span>
            <div className="flex gap-2">
              <Button size="default" onClick={() => setOpen(false)}>
                <span className="px-[2px]">Cancel</span>
              </Button>
              <Button
                variant="default"
                disabled={!draft?.from || !draft?.to}
                onClick={() => {
                  if (draft?.from && draft?.to) onRangeChange({ from: draft.from, to: draft.to })
                  setOpen(false)
                }}
              >
                <span className="px-[2px]">Apply</span>
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function downloadCsv(rows: Transaction[], range: Range) {
  const header = ["Date", "Transaction", "Category", "Payment Method", "Amount"]
  const esc = (v: string | number) => `"${String(v).replaceAll('"', '""')}"`
  const csv = [header, ...rows.map((r) => [r.date, r.name, r.category, r.method, r.amount.toFixed(2)])]
    .map((line) => line.map(esc).join(","))
    .join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  const iso = (d: Date) => d.toISOString().slice(0, 10)
  a.href = url
  a.download = `tidewell-report_${iso(range.from)}_${iso(range.to)}.csv`
  a.click()
  URL.revokeObjectURL(url)
  toast.success("Report downloaded", {
    description: `${rows.length} transaction${rows.length === 1 ? "" : "s"} exported as CSV.`,
  })
}
