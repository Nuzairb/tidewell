"use client"

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react"
import { DayPicker, type DayButtonProps } from "react-day-picker"
import { endOfMonth, isAfter, isBefore, isSameDay, startOfDay } from "date-fns"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/icon"

export type DateRangeValue = { from?: Date; to?: Date }

type Drag =
  | null
  /** moving one end; `anchor` is the end that stays put */
  | { kind: "handle"; anchor: Date; moved: boolean }
  /** pressed on a fresh day; dragging creates a range from it */
  | { kind: "new"; anchor: Date; moved: boolean }

const noop = () => {}
const ISO_ATTR = "data-iso"
const toIso = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
const fromIso = (s: string) => {
  const [y, m, d] = s.split("-").map(Number)
  return new Date(y, m - 1, d)
}
const ordered = (a: Date, b: Date): Required<DateRangeValue> =>
  isBefore(b, a) ? { from: b, to: a } : { from: a, to: b }

/**
 * Statsnap range calendar.
 *
 * - Fixed 36px cells → every row is identical (no fractional flex widths).
 * - Press-and-drag across days to create a range.
 * - Grab EITHER end of an existing range and drag it; crossing the other end
 *   swaps them naturally.
 * - Click-click also works (first click = start, second = end, with a hover
 *   preview in between). Keyboard: arrows move focus, Enter/Space selects.
 * - Dragging is direct manipulation → no animation; only hover colours fade.
 */
export function RangeCalendar({
  value,
  onChange,
  numberOfMonths = 2,
  defaultMonth,
  startMonth,
  endMonth,
  className,
}: {
  value: DateRangeValue | undefined
  onChange: (value: DateRangeValue) => void
  numberOfMonths?: number
  defaultMonth?: Date
  startMonth?: Date
  endMonth?: Date
  className?: string
}) {
  const from = value?.from ? startOfDay(value.from) : undefined
  const to = value?.to ? startOfDay(value.to) : undefined
  const pending = !!from && !to

  const dragRef = useRef<Drag>(null)
  const [dragging, setDragging] = useState(false)
  const [hover, setHover] = useState<Date | null>(null)

  const dayAt = (x: number, y: number) => {
    const el = document.elementFromPoint(x, y)?.closest(`[${ISO_ATTR}]`)
    return el ? fromIso(el.getAttribute(ISO_ATTR)!) : null
  }

  const endDrag = useCallback(() => {
    dragRef.current = null
    setDragging(false)
  }, [])

  // keep the "grabbing" cursor even when the pointer leaves the grid mid-drag
  useEffect(() => {
    if (!dragging) return
    const body = document.body
    body.style.cursor = "grabbing"
    return () => {
      body.style.removeProperty("cursor")
    }
  }, [dragging])

  useEffect(() => {
    window.addEventListener("pointerup", endDrag)
    window.addEventListener("pointercancel", endDrag)
    return () => {
      window.removeEventListener("pointerup", endDrag)
      window.removeEventListener("pointercancel", endDrag)
    }
  }, [endDrag])

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const day = dayAt(e.clientX, e.clientY)
    if (!day) return
    e.preventDefault() // no text selection / focus jump while dragging

    if (from && to && isSameDay(day, from) && !isSameDay(from, to)) {
      dragRef.current = { kind: "handle", anchor: to, moved: false }
    } else if (from && to && isSameDay(day, to) && !isSameDay(from, to)) {
      dragRef.current = { kind: "handle", anchor: from, moved: false }
    } else if (pending && from) {
      // second click of click-click selection; keep dragging to fine-tune
      onChange(ordered(from, day))
      dragRef.current = { kind: "handle", anchor: from, moved: false }
    } else {
      onChange({ from: day, to: undefined })
      dragRef.current = { kind: "new", anchor: day, moved: false }
    }
    setDragging(true)
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const day = dayAt(e.clientX, e.clientY)
    const drag = dragRef.current
    if (!drag) {
      setHover(day)
      return
    }
    if (!day) return
    if (drag.kind === "new" && isSameDay(day, drag.anchor) && !drag.moved) return
    drag.moved = true
    onChange(ordered(drag.anchor, day))
  }

  // Keyboard / assistive-tech activation (pointer presses are handled above)
  const onKeyboardSelect = (day: Date) => {
    if (pending && from) onChange(ordered(from, day))
    else onChange({ from: day, to: undefined })
  }

  const preview = pending && from && hover && !isSameDay(hover, from) ? ordered(from, hover) : null
  const band = from && to ? { from, to } : preview

  const modifiers = {
      r_start: (d: Date) => !!band && isSameDay(d, band.from),
      r_end: (d: Date) => !!band && isSameDay(d, band.to),
      r_single: (d: Date) => !!from && (!band || isSameDay(band.from, band.to)) && isSameDay(d, from),
      r_mid: (d: Date) => !!band && isAfter(d, band.from) && isBefore(d, band.to),
      r_preview: () => !!preview,
      r_endpoint: (d: Date) =>
        (!!from && isSameDay(d, from)) || (!!to && isSameDay(d, to)) || (!!preview && isSameDay(d, preview.to)),
      month_first: (d: Date) => d.getDate() === 1,
      month_last: (d: Date) => isSameDay(d, endOfMonth(d)),
  }

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setHover(null)}
      data-dragging={dragging || undefined}
      className={cn("touch-none select-none", className)}
    >
      <DayPicker
        numberOfMonths={numberOfMonths}
        defaultMonth={defaultMonth}
        startMonth={startMonth}
        endMonth={endMonth}
        // makes days interactive (renders <button>s); selection itself is handled by the pointer/keyboard logic above
        onDayClick={noop}
        showOutsideDays={false}
        fixedWeeks
        modifiers={modifiers}
        modifiersClassNames={{
          r_mid: "sn-band sn-band-mid",
          r_start: "sn-band sn-band-start",
          r_end: "sn-band sn-band-end",
          r_preview: "sn-band-preview",
          month_first: "sn-month-first",
          month_last: "sn-month-last",
        }}
        classNames={{
          root: "relative w-fit",
          months: "flex gap-6",
          month: "flex flex-col gap-3",
          month_caption: "flex h-7 items-center justify-center",
          caption_label: "text-sm font-semibold text-fg",
          nav: "absolute inset-x-0 top-0 z-10 flex h-7 items-center justify-between",
          button_previous:
            "sn-pressable flex size-7 items-center justify-center rounded-md text-fg-muted disabled:pointer-events-none disabled:opacity-40",
          button_next:
            "sn-pressable flex size-7 items-center justify-center rounded-md text-fg-muted disabled:pointer-events-none disabled:opacity-40",
          month_grid: "border-separate border-spacing-0",
          weekdays: "",
          weekday: "h-7 w-9 p-0 text-center text-xs font-medium text-fg-subtle",
          week: "",
          day: "sn-day relative size-9 p-0 text-center",
          day_button: "",
          today: "sn-today",
          hidden: "invisible",
        }}
        components={{
          Chevron: ({ orientation }) => (
            <Icon name="chevron-right" className={orientation === "left" ? "rotate-180" : undefined} />
          ),
          DayButton: (props: DayButtonProps) => (
            <RangeDayButton {...props} onKeyboardSelect={onKeyboardSelect} />
          ),
        }}
      />
    </div>
  )
}

function RangeDayButton({
  day,
  modifiers,
  onKeyboardSelect,
  className,
  onClick: _onClick, // eslint-disable-line @typescript-eslint/no-unused-vars
  ...props
}: DayButtonProps & { onKeyboardSelect: (d: Date) => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  const endpoint = !!modifiers.r_endpoint
  const solid = endpoint && !modifiers.r_preview
  const previewEnd = endpoint && !!modifiers.r_preview && !modifiers.r_start

  return (
    <button
      ref={ref}
      type="button"
      {...props}
      {...{ [ISO_ATTR]: toIso(day.date) }}
      data-endpoint={endpoint || undefined}
      aria-pressed={endpoint || !!modifiers.r_mid}
      onClick={(e) => {
        // pointer presses are handled on pointerdown; detail === 0 → keyboard/AT
        if (e.detail === 0) onKeyboardSelect(day.date)
      }}
      className={cn(
        "relative z-10 flex size-9 cursor-pointer items-center justify-center rounded-md text-sm leading-none font-medium tabular-nums outline-none",
        "transition-colors duration-(--duration-press) ease-out-strong",
        "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-(--ring-focus)",
        solid
          ? "cursor-grab bg-accent-solid text-white shadow-[0_1px_2px_rgba(9,9,11,0.16),inset_0_1px_0_rgba(255,255,255,0.16)]"
          : previewEnd
            ? "text-fg-accent ring-1 ring-(--accent-solid) ring-inset"
            : modifiers.r_mid
              ? "text-fg [@media(hover:hover)]:hover:bg-accent-soft"
              : "text-fg [@media(hover:hover)]:hover:bg-nav-hover",
        modifiers.today && !solid && "text-fg-accent",
        className
      )}
    >
      {day.date.getDate()}
      {/* grip ticks hint that endpoints can be dragged */}
      {solid && !modifiers.r_single && (
        <span
          aria-hidden
          className={cn(
            "absolute top-1/2 h-3 w-[2px] -translate-y-1/2 rounded-full bg-white/50",
            modifiers.r_start ? "left-1" : "right-1"
          )}
        />
      )}
    </button>
  )
}

