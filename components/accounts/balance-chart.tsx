import { HISTORY_MONTHS } from "@/lib/data"
import { formatUsdWhole } from "@/lib/format"

const W = 600
const H = 120
const GRID_LINES = 3

/**
 * Month-end balance line, Apr → Sep. Same marks as the Cash Flow chart:
 * 1.5px income-blue line, dashed grid, active (current) month label in accent.
 * Static — six points don't need a scrubber.
 */
export function BalanceChart({ values, label }: { values: number[]; label: string }) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  // 15% headroom so the line never touches the top or bottom edge
  const pad = (max - min) * 0.15 || 1
  const lo = min - pad
  const hi = max + pad

  const points = values.map((v, i) => ({
    x: (i / (values.length - 1)) * W,
    y: H - ((v - lo) / (hi - lo)) * H,
  }))
  const line = points.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ")
  const area = `${line} L${W},${H} L0,${H} Z`
  const last = points.at(-1)!

  return (
    <figure className="flex flex-col gap-2">
      <div className="relative h-[120px]">
        <svg
          role="img"
          aria-label={`${label}: ${formatUsdWhole(values[0])} in ${HISTORY_MONTHS[0]} to ${formatUsdWhole(values.at(-1)!)} in ${HISTORY_MONTHS.at(-1)}`}
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 size-full overflow-visible"
        >
          {Array.from({ length: GRID_LINES }, (_, i) => {
            const y = ((i + 0.5) / GRID_LINES) * H
            return (
              <line
                key={i}
                x1={0}
                x2={W}
                y1={y}
                y2={y}
                stroke="var(--border-subtle)"
                strokeDasharray="4 4"
                vectorEffect="non-scaling-stroke"
              />
            )
          })}
          <path d={area} fill="var(--accent-soft)" opacity={0.6} />
          <path
            d={line}
            fill="none"
            stroke="var(--series-income)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {/* HTML dot so it stays round while the SVG stretches */}
        <span
          aria-hidden
          className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-(--bg-surface) bg-accent-solid shadow-(--shadow-chip-base)"
          style={{ left: `${(last.x / W) * 100}%`, top: `${(last.y / H) * 100}%` }}
        />
      </div>
      <figcaption className="flex justify-between">
        {HISTORY_MONTHS.map((m, i) => (
          <span
            key={m}
            className={
              i === HISTORY_MONTHS.length - 1
                ? "text-sm leading-axis font-semibold text-fg-accent"
                : "text-sm leading-axis font-medium text-fg-muted"
            }
          >
            {m}
          </span>
        ))}
      </figcaption>
    </figure>
  )
}
