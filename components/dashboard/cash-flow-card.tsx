"use client"

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"
import { cn } from "@/lib/utils"
import {
  MONTHS,
  MONTH_BOUNDARIES,
  PINNED_DAY,
  PINNED_READOUT,
  PLOT,
  Y_TICKS,
  parseSeries,
  readoutForDay,
  xToDay,
  type Readout,
  type Series,
} from "@/lib/chart"
import { formatUsd } from "@/lib/format"

const TOOLTIP_WIDTH = 271.1 // Figma 1:261
const TOOLTIP_GAP = 16 // crosshair → tooltip
const POINT = { w: 34.5981, h: 28.4311 } // native size of the point SVGs (incl. drop-shadow bleed)

/** Phones: the plot is drawn this wide and panned horizontally (~3px per day, ≈3 months on screen). */
const MOBILE_PLOT_WIDTH = 820

const pct = (x: number, total: number) => `${(x / total) * 100}%`

/** Figma node 1:213 — Cash Flow card. */
export function CashFlowCard() {
  const series = useSeries()
  const plotRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [pinnedDay, setPinnedDay] = useState<number | null>(null) // null = Figma's pinned state
  const [hoverDay, setHoverDay] = useState<number | null>(null)

  const activeDay = hoverDay ?? pinnedDay
  const readout: Readout = series && activeDay !== null ? readoutForDay(series, activeDay) : PINNED_READOUT

  const dayFromPointer = useCallback((clientX: number) => {
    const rect = plotRef.current?.getBoundingClientRect()
    if (!rect) return null
    return xToDay(((clientX - rect.left) / rect.width) * PLOT.width)
  }, [])

  /** true when the plot is wider than its viewport (phones) → touch pans instead of scrubbing */
  const isPannable = () => {
    const el = scrollRef.current
    return !!el && el.scrollWidth > el.clientWidth + 1
  }

  // Phones: open the zoomed chart centred on the highlighted week, not on January.
  useEffect(() => {
    const el = scrollRef.current
    if (!el || el.scrollWidth <= el.clientWidth) return
    el.scrollLeft = (PINNED_READOUT.x / PLOT.width) * el.scrollWidth - el.clientWidth / 2
  }, [])

  const net = readout.income - readout.expenses
  const plotWidth = usePlotWidth(plotRef)
  // keep the tooltip inside the plot: flip to the crosshair's left when it would overflow
  const flip = (readout.x / PLOT.width) * plotWidth + TOOLTIP_GAP + TOOLTIP_WIDTH > plotWidth

  return (
    <section
      aria-labelledby="cashflow-title"
      className="sn-enter flex w-full shrink-0 flex-col gap-4 overflow-hidden rounded-card bg-surface p-4 shadow-card sm:gap-6 sm:py-5"
      style={{ animationDelay: "160ms" }}
    >
      {/* Header — 1:214 */}
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <h2 id="cashflow-title" className="text-base leading-[22px] font-semibold whitespace-nowrap text-fg">
            Cash Flow
          </h2>
          <span aria-hidden className="h-3 w-px bg-line" />
          <p className="text-sm font-medium whitespace-nowrap text-fg-muted">Weekly totals</p>
        </div>
        <ul aria-label="Legend" className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <LegendItem color="var(--series-income)" ring="var(--series-income-ring)" label="Income" />
          <LegendItem color="var(--series-expenses)" ring="var(--series-expenses-ring)" label="Expenses" />
          <LegendItem color="var(--series-net)" ring="var(--series-net-ring)" label="Net cashflow" />
        </ul>
      </div>

      {/* Phones/tablets: the floating tooltip would cover the plot, so the
          readout docks above the chart instead. Same data, same tokens. */}
      <div aria-hidden className="flex items-end justify-between gap-3 rounded-xl bg-sunken p-3 md:hidden">
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="text-xl font-semibold text-fg-strong tabular-nums">
            {net < 0 ? "−" : ""}
            {formatUsd(Math.abs(net))}
          </p>
          <p className="truncate text-xs font-medium text-fg-muted">Net cashflow · {readout.label}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-1.5">
          <ReadoutRow color="var(--series-income)" ring="var(--series-income-ring)" value={readout.income} />
          <ReadoutRow color="var(--series-expenses)" ring="var(--series-expenses-ring)" value={readout.expenses} />
        </div>
      </div>

      {/* Chart — 1:229 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2 sm:gap-4">
          {/* Y axis — 1:231 (stays put while the plot pans on phones) */}
          <div
            aria-hidden
            className="flex h-[262px] w-9 shrink-0 flex-col items-end justify-between text-right text-xs leading-axis font-medium text-fg-muted sm:w-12 sm:text-sm"
          >
            {Y_TICKS.map((t) => (
              <span key={t} className="w-full">
                <span className="hidden sm:inline">${t.toLocaleString("en-US")}</span>
                <span className="sm:hidden">{compactTick(t)}</span>
              </span>
            ))}
          </div>

          {/* Phones: horizontal scroller so the 9-month series isn't crushed into ~280px.
              Edge fades hint that there's more to either side. ≥ md it's a plain box. */}
          <div
            ref={scrollRef}
            className={cn(
              "min-w-0 flex-1",
              "max-md:snap-none max-md:overflow-x-auto max-md:overscroll-x-contain max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden",
              "max-md:[mask-image:linear-gradient(to_right,transparent,#000_14px,#000_calc(100%-14px),transparent)]"
            )}
          >
            <div className="flex w-full flex-col gap-2 max-md:w-(--mobile-plot-width)" style={{ "--mobile-plot-width": `${MOBILE_PLOT_WIDTH}px` } as CSSProperties}>
          {/* Plot area — 1:238 */}
          <div className="flex h-[262px] min-w-0 flex-col py-2">
            <div
              ref={plotRef}
              tabIndex={0}
              role="group"
              aria-roledescription="chart"
              aria-label="Cash flow, income versus expenses, Jan 1 to Sep 30 2026. Use the left and right arrow keys to move between days, Shift for a week, Home and End to jump to the ends."
              aria-describedby="cashflow-readout"
              className="relative h-[246px] w-full touch-manipulation outline-none md:touch-pan-y select-none focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--ring-focus)"
              onPointerMove={(e) => {
                if (!series) return
                // on phones a finger drag pans the zoomed chart; don't scrub underneath it
                if (e.pointerType !== "mouse" && isPannable()) return
                setHoverDay(dayFromPointer(e.clientX))
              }}
              onPointerDown={(e) => {
                // larger touch screens: scrub immediately on press (vertical drags still scroll the page)
                if (series && e.pointerType !== "mouse" && !isPannable()) setHoverDay(dayFromPointer(e.clientX))
              }}
              onPointerCancel={() => setHoverDay(null)}
              onPointerUp={(e) => {
                // touch: lifting the finger pins wherever you scrubbed to
                if (series && e.pointerType !== "mouse") {
                  setPinnedDay(dayFromPointer(e.clientX))
                  setHoverDay(null)
                }
              }}
              onPointerLeave={() => setHoverDay(null)}
              onClick={(e) => {
                if (!series) return
                setPinnedDay(dayFromPointer(e.clientX))
              }}
              onKeyDown={(e) => {
                if (!series) return
                const current = activeDay ?? PINNED_DAY
                const step = e.shiftKey ? 7 : 1
                if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                  e.preventDefault()
                  const next = Math.min(PLOT.days - 1, Math.max(0, current + (e.key === "ArrowRight" ? step : -step)))
                  setHoverDay(null)
                  setPinnedDay(next)
                } else if (e.key === "Home" || e.key === "End") {
                  e.preventDefault()
                  setHoverDay(null)
                  setPinnedDay(e.key === "Home" ? 0 : PLOT.days - 1)
                }
              }}
            >
              {/* Gridlines — Figma asset (247px tall, sits 1px above the plot) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/chart-grid.svg"
                alt=""
                width={1036}
                height={247}
                className="pointer-events-none absolute inset-x-0 top-[-1px] block h-[247px] w-full max-w-none opacity-(--chart-grid-opacity)"
              />

              {/* Crosshair — rotated 246×1 Figma asset */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 flex w-0 items-center justify-center"
                style={{ left: pct(readout.x, PLOT.width) }}
              >
                <div className="h-px w-[246px] shrink-0 rotate-90">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/figma/crosshair.svg" alt="" width={246} height={1} className="block size-full max-w-none" />
                </div>
              </div>

              {/* Series lines — Figma asset, stretched exactly like the frame */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/chart-lines.svg"
                alt=""
                width={1036}
                height={246}
                className="pointer-events-none absolute inset-0 block size-full max-w-none"
              />

              {/* Points */}
              <ChartPoint src="/figma/point-income.svg" x={readout.pointX} y={readout.incomeY} />
              <ChartPoint src="/figma/point-expenses.svg" x={readout.pointX} y={readout.expensesY} />

              {/* Tooltip — 1:261 */}
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute top-0 hidden flex-col justify-center gap-4 overflow-hidden rounded-card p-3 md:flex",
                  "border-[0.5px] border-(--highlight-edge) bg-tooltip shadow-tooltip"
                )}
                style={{
                  width: TOOLTIP_WIDTH,
                  left: flip
                    ? `calc(${pct(readout.x, PLOT.width)} - ${TOOLTIP_GAP + TOOLTIP_WIDTH}px)`
                    : `calc(${pct(readout.x, PLOT.width)} + ${TOOLTIP_GAP}px)`,
                }}
              >
                <div className="flex flex-col gap-1.5 whitespace-nowrap">
                  <p className="text-2xl font-semibold text-fg-on-tooltip tabular-nums">
                    {net < 0 ? "−" : ""}
                    {formatUsd(Math.abs(net))}
                  </p>
                  <p className="text-sm font-normal text-fg-on-tooltip-muted">Net cashflow · {readout.label}</p>
                </div>
                <div className="flex w-full flex-col gap-2">
                  <TooltipRow color="var(--series-income)" ring="var(--series-income-ring)" label="Income" value={readout.income} />
                  <TooltipRow
                    color="var(--series-expenses)"
                    ring="var(--series-expenses-ring)"
                    label="Expenses"
                    value={readout.expenses}
                  />
                </div>
                <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-inner-glow" />
              </div>
            </div>
          </div>

        {/* X axis — labels centred on the month gridlines; scrolls with the plot */}
        <div aria-hidden className="relative h-[17px] text-center text-xs leading-axis sm:text-sm">
          {MONTHS.map((m, i) => (
            <span
              key={m}
              className={cn(
                "absolute top-0",
                i === readout.monthIndex ? "font-semibold text-fg-accent" : "font-medium text-fg-muted"
              )}
              style={{
                left: pct(MONTH_BOUNDARIES[i], PLOT.width),
                width: pct(MONTH_BOUNDARIES[i + 1] - MONTH_BOUNDARIES[i], PLOT.width),
              }}
            >
              {m}
            </span>
          ))}
        </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs font-medium text-fg-subtle md:hidden">Swipe to pan · tap a day for details</p>
      </div>

      <p id="cashflow-readout" aria-live="polite" className="sr-only">
        {readout.label}: income {formatUsd(readout.income)}, expenses {formatUsd(readout.expenses)}, net cashflow{" "}
        {formatUsd(net)}.
      </p>
    </section>
  )
}

function ChartPoint({ src, x, y }: { src: string; x: number; y: number }) {
  const style: CSSProperties = {
    width: POINT.w,
    height: POINT.h,
    left: `calc(${pct(x, PLOT.width)} - ${POINT.w / 2}px)`,
    top: `calc(${pct(y, PLOT.height)} - ${POINT.h / 2}px)`,
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" width={POINT.w} height={POINT.h} aria-hidden className="pointer-events-none absolute block max-w-none" style={style} />
}

/** "$2.5k" style labels for the narrow phone Y axis */
const compactTick = (t: number) => (t < 1000 ? "$" + t : "$" + t / 1000 + "k")

function ReadoutRow({ color, ring, value }: { color: string; ring: string; value: number }) {
  return (
    <span className="flex items-center justify-end gap-2">
      <Chip color={color} ring={ring} />
      <span className="text-xs font-medium whitespace-nowrap text-fg tabular-nums">{formatUsd(value)}</span>
    </span>
  )
}

function usePlotWidth(ref: React.RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = useState<number>(PLOT.width)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return width
}

function Chip({ color, ring }: { color: string; ring: string }) {
  return (
    <span
      aria-hidden
      className="relative size-2.5 shrink-0 rounded-chip border-[0.5px] border-(--highlight-edge)"
      style={{ boxShadow: `var(--shadow-chip-base), 0px 0px 0px 1px ${ring}` }}
    >
      <span className="absolute inset-0 rounded-chip" style={{ background: color }} />
      <span className="absolute inset-0 rounded-[inherit] shadow-inner-glow" />
    </span>
  )
}

function LegendItem({ color, ring, label }: { color: string; ring: string; label: string }) {
  return (
    <li className="flex items-center gap-2.5">
      <Chip color={color} ring={ring} />
      <span className="text-sm font-medium tracking-label whitespace-nowrap text-fg-muted">{label}</span>
    </li>
  )
}

function TooltipRow({ color, ring, label, value }: { color: string; ring: string; label: string; value: number }) {
  return (
    <div className="flex w-full items-center justify-between">
      <span className="flex items-center gap-2">
        <Chip color={color} ring={ring} />
        <span className="text-sm font-normal whitespace-nowrap text-fg-on-tooltip-muted">{label}</span>
      </span>
      <span className="text-sm font-normal whitespace-nowrap text-fg-on-tooltip tabular-nums">{formatUsd(value)}</span>
    </div>
  )
}

/** Reads the Figma line export once and turns it into data for hit-testing. */
function useSeries() {
  const [series, setSeries] = useState<Series | null>(null)
  useEffect(() => {
    let cancelled = false
    fetch("/figma/chart-lines.svg")
      .then((r) => r.text())
      .then((svg) => {
        if (!cancelled) setSeries(parseSeries(svg))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])
  return series
}
