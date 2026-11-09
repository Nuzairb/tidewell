import { parseLimit } from "@/components/budget/budget-math"
import { Input } from "@/components/ui/input"

/** 26px in-card dollar field; same focus ring as the header search. */
export function LimitInput({
  category,
  value,
  onChange,
}: {
  category: string
  value: string
  onChange: (value: string) => void
}) {
  const invalid = parseLimit(value) === undefined
  return (
    <span className="relative inline-flex w-24 shrink-0 items-center">
      <span aria-hidden className="pointer-events-none absolute left-2 text-sm font-medium text-fg-muted">
        $
      </span>
      <Input
        inputMode="numeric"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`${category} monthly limit, in dollars`}
        aria-invalid={invalid}
        className="h-[26px] rounded-md border-0 bg-control pr-2 pl-5 text-right text-base font-medium text-fg tabular-nums shadow-control transition-shadow duration-(--duration-fast) ease-out-strong focus-visible:shadow-[0_0_0_1px_var(--accent-solid),0_0_0_4px_var(--accent-soft)] focus-visible:ring-0 aria-invalid:shadow-[0_0_0_1px_var(--fg-negative)] aria-invalid:ring-0 md:text-sm"
      />
    </span>
  )
}
