import { formatUsd } from "@/lib/format"
import { cn } from "@/lib/utils"

export type Column = { key: string; label: string; name: string; value: number }

/** Space taken by the value label above each bar (12px text + 6px gap). */
const LABEL_SPACE = 18

/** "$4.4k" — short enough to sit above a 30px column on phones. */
const formatCompact = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${Math.round(n)}`)

/**
 * Plain column chart. One series, so one colour: the highlighted column
 * (current month, busiest day) is solid accent, the rest a tint of it.
 * Static — the values are printed, nothing to scrub.
 */
export function ColumnChart({
  columns,
  highlight,
  label,
  average,
  height = 180,
}: {
  columns: Column[]
  highlight: number
  label: string
  /** dashed reference line */
  average?: number
  height?: number
}) {
  const max = Math.max(...columns.map((c) => c.value))

  return (
    <figure className="flex flex-col gap-2">
      <div className="relative" style={{ height }}>
        {average !== undefined && (
          <span
            aria-hidden
            className="absolute inset-x-0 border-t border-dashed border-line"
            style={{ bottom: `calc((100% - ${LABEL_SPACE}px) * ${average / max})` }}
          />
        )}
        <ol aria-label={label} className="absolute inset-0 flex gap-1 sm:gap-3">
          {columns.map((c, i) => {
            const active = i === highlight
            return (
              <li key={c.key} className="flex h-full min-w-0 flex-1 flex-col items-center gap-1.5">
                <span className="sr-only">
                  {c.name}: {formatUsd(c.value)}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "text-xs leading-none font-medium tabular-nums",
                    active ? "text-fg-accent" : "text-fg-muted"
                  )}
                >
                  {formatCompact(c.value)}
                </span>
                <span aria-hidden className="relative w-full flex-1">
                  <span
                    className={cn(
                      "absolute inset-x-0 bottom-0 mx-auto max-w-10 rounded-t-chip",
                      active ? "bg-accent-solid" : "bg-series-income/20"
                    )}
                    style={{ height: `${(c.value / max) * 100}%` }}
                  />
                </span>
              </li>
            )
          })}
        </ol>
      </div>
      <figcaption aria-hidden className="flex gap-1 sm:gap-3">
        {columns.map((c, i) => (
          <span
            key={c.key}
            className={cn(
              "min-w-0 flex-1 text-center text-sm leading-axis",
              i === highlight ? "font-semibold text-fg-accent" : "font-medium text-fg-muted"
            )}
          >
            {c.label}
          </span>
        ))}
      </figcaption>
    </figure>
  )
}
