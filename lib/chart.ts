/**
 * Cash-flow chart geometry.
 *
 * The plotted lines are rendered straight from the Figma export
 * (`/figma/chart-lines.svg`, 1036×246 viewBox). For interactivity we read the
 * very same file at runtime and turn each <path> back into points, so the
 * hover crosshair always sits exactly on the drawn line — one source of truth.
 *
 * Coordinate system (Figma "Plot" frame, node 1:239):
 *   x: 0 → 1036  ·  one point per day, Jan 1 → Sep 30 2026 (273 days)
 *   y: 0 → 246   ·  $2,500 at y=0, $0 at y=246
 */

export const PLOT = {
  width: 1036,
  height: 246,
  yMax: 2500,
  firstX: 1.93645,
  lastX: 1034.06,
  days: 273,
  start: new Date(2026, 0, 1),
} as const

export const DAY_STEP = (PLOT.lastX - PLOT.firstX) / (PLOT.days - 1)

/** Month gridline x-positions, taken from the Figma gridline layers (1:247–1:254). */
export const MONTH_BOUNDARIES = [
  0, 117.57, 224.075, 341.645, 455.065, 572.635, 687.439, 805.009, 922.579, PLOT.width,
] as const

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"] as const

export const Y_TICKS = [2500, 2000, 1500, 1000, 500, 0] as const

export type Point = { x: number; y: number }
export type Series = { income: Point[]; expenses: Point[] }

export function parseSeries(svg: string): Series | null {
  const paths = [...svg.matchAll(/<path id="([^"]+)" d="([^"]+)"/g)]
  const toPoints = (d: string) =>
    [...d.matchAll(/[ML]([\d.]+) ([\d.]+)/g)].map((m) => ({ x: Number(m[1]), y: Number(m[2]) }))
  const income = paths.find((p) => p[1].startsWith("Income"))
  const expenses = paths.find((p) => p[1].startsWith("Expenses"))
  if (!income || !expenses) return null
  return { income: toPoints(income[2]), expenses: toPoints(expenses[2]) }
}

/** Linear interpolation of a polyline at x. */
export function sampleY(points: Point[], x: number): number {
  if (x <= points[0].x) return points[0].y
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    if (x <= b.x) return a.y + ((b.y - a.y) * (x - a.x)) / (b.x - a.x)
  }
  return points[points.length - 1].y
}

export const yToValue = (y: number) => ((PLOT.height - y) / PLOT.height) * PLOT.yMax
export const dayToX = (day: number) => PLOT.firstX + day * DAY_STEP
export const xToDay = (x: number) =>
  Math.min(PLOT.days - 1, Math.max(0, Math.round((x - PLOT.firstX) / DAY_STEP)))

export function dayToDate(day: number) {
  const d = new Date(PLOT.start)
  d.setDate(d.getDate() + day)
  return d
}

export function monthIndexForX(x: number) {
  for (let i = MONTH_BOUNDARIES.length - 2; i >= 0; i--) {
    if (x >= MONTH_BOUNDARIES[i]) return i
  }
  return 0
}

const short = new Intl.DateTimeFormat("en-US", { month: "short" })

/** "Jun 18–24" or "Jun 29–Jul 5" for the 7-day window centred on `day`. */
export function weekLabel(day: number) {
  const startDay = Math.max(0, day - 3)
  const endDay = Math.min(PLOT.days - 1, day + 3)
  const a = dayToDate(startDay)
  const b = dayToDate(endDay)
  const sameMonth = a.getMonth() === b.getMonth()
  return `${short.format(a)} ${a.getDate()}–${sameMonth ? "" : `${short.format(b)} `}${b.getDate()}`
}

export type Readout = {
  /** crosshair x in plot units */
  x: number
  /** marker centre x in plot units */
  pointX: number
  incomeY: number
  expensesY: number
  income: number
  expenses: number
  label: string
  monthIndex: number
}

/**
 * The exact state drawn in Figma (crosshair 1:255, points 1:259/1:260,
 * tooltip 1:261). Shown until the user interacts with the chart.
 */
export const PINNED_READOUT: Readout = {
  x: 652.1682,
  pointX: 642.5214 + 16.5981 / 2,
  incomeY: 97.6125 + 10.4311 / 2,
  expensesY: 116.955 + 10.4311 / 2,
  income: 1455.0,
  expenses: 1258.43,
  label: "Jun 18–24",
  monthIndex: 5,
}

export function readoutForDay(series: Series, day: number): Readout {
  const x = dayToX(day)
  const incomeY = sampleY(series.income, x)
  const expensesY = sampleY(series.expenses, x)
  return {
    x,
    pointX: x,
    incomeY,
    expensesY,
    income: yToValue(incomeY),
    expenses: yToValue(expensesY),
    label: weekLabel(day),
    monthIndex: monthIndexForX(x),
  }
}

export const PINNED_DAY = 171 // Jun 21 2026 — centre of "Jun 18–24"
