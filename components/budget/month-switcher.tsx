"use client"

import type { BudgetMonth } from "@/lib/data/budget"
import { cn } from "@/lib/utils"

/** Segmented control: the active month is "where you are", so it takes the accent. */
export function MonthSwitcher({
  months,
  value,
  onChange,
  disabled,
}: {
  months: BudgetMonth[]
  value: string
  onChange: (id: string) => void
  disabled?: boolean
}) {
  return (
    <div
      role="group"
      aria-label="Budget month"
      className={cn(
        "flex h-[30px] items-center gap-0.5 rounded-lg bg-sunken p-0.5 shadow-control",
        disabled && "opacity-50"
      )}
    >
      {months.map((month) => {
        const selected = month.id === value
        return (
          <button
            key={month.id}
            type="button"
            aria-pressed={selected}
            aria-label={`${month.label} ${month.year}`}
            disabled={disabled}
            onClick={() => onChange(month.id)}
            className={cn(
              "h-[26px] cursor-pointer rounded-md px-2.5 text-sm leading-none font-medium outline-none",
              "transition-[background-color,box-shadow,color] duration-(--duration-press) ease-out-strong",
              "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-(--ring-focus)",
              "disabled:cursor-not-allowed",
              selected
                ? "bg-surface font-semibold text-fg-accent shadow-control"
                : "text-fg-muted [@media(hover:hover)]:hover:text-fg"
            )}
          >
            {month.short}
          </button>
        )
      })}
    </div>
  )
}
