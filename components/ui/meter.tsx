import { cn } from "@/lib/utils"

/**
 * 6px progress bar for budgets and goals.
 * `accent` = progress toward a target; `negative` = close to or over a limit.
 */
export function Meter({
  value,
  label,
  tone = "accent",
  className,
}: {
  /** 0–1; values above 1 render full */
  value: number
  label: string
  tone?: "accent" | "negative"
  className?: string
}) {
  const pct = Math.round(Math.min(Math.max(value, 0), 1) * 100)
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className={cn("h-1.5 w-full overflow-hidden rounded-pill bg-pressed", className)}
    >
      <div
        className={cn("h-full rounded-pill", tone === "negative" ? "bg-negative" : "bg-accent-solid")}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
