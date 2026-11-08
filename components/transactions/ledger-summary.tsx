import type { Transaction } from "@/lib/data"
import { formatSignedUsd, formatUsd } from "@/lib/format"
import { cn } from "@/lib/utils"

const signed = (n: number) => (n === 0 ? formatUsd(0) : formatSignedUsd(n))

/**
 * Moves between your own accounts. The ledger lists them, but they aren't
 * money in or out — counting them would inflate income (Reports leaves them out too).
 */
const INTERNAL_CATEGORIES = new Set(["Transfer", "Contribution"])

/** Count · money in · money out · net for whatever the filters currently show. */
export function LedgerSummary({ rows }: { rows: Transaction[] }) {
  const flows = rows.filter((t) => !INTERNAL_CATEGORIES.has(t.category))
  const moneyIn = flows.reduce((sum, t) => (t.amount > 0 ? sum + t.amount : sum), 0)
  const moneyOut = flows.reduce((sum, t) => (t.amount < 0 ? sum + t.amount : sum), 0)
  const net = moneyIn + moneyOut

  const cells = [
    { label: "Transactions", value: rows.length.toLocaleString("en-US"), className: "text-fg-numeric" },
    { label: "Money in", value: signed(moneyIn), className: moneyIn > 0 ? "text-positive" : "text-fg-numeric" },
    { label: "Money out", value: signed(moneyOut), className: "text-fg-numeric" },
    { label: "Net", value: signed(net), className: net > 0 ? "text-positive" : "text-fg-numeric" },
  ]

  return (
    <section
      aria-label="Totals for the filtered transactions"
      className="sn-enter overflow-hidden rounded-card bg-surface shadow-card"
    >
      <dl className="grid grid-cols-2 md:grid-cols-4">
        {cells.map((cell, i) => (
          <div
            key={cell.label}
            className={cn(
              "flex min-w-0 flex-col gap-2.5 border-line p-4",
              i % 2 === 0 && "border-r",
              i < 2 && "border-b md:border-b-0",
              i === 1 && "md:border-r"
            )}
          >
            <dt className="truncate text-sm font-medium tracking-label text-fg-muted">{cell.label}</dt>
            <dd className={cn("truncate text-base leading-none font-semibold tabular-nums", cell.className)}>
              {cell.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
