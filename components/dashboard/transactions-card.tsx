"use client"

import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Transaction } from "@/lib/data"
import { formatDate, formatSignedUsd, parseIsoDate } from "@/lib/format"
import { cn } from "@/lib/utils"

const COLS = [
  { key: "date", label: "Date", className: "w-[150px]" },
  { key: "name", label: "Transaction", className: "w-[220px]" },
  { key: "category", label: "Category", className: "" },
  { key: "method", label: "Payment Method", className: "" },
  { key: "amount", label: "Amount", className: "text-right" },
] as const

/** Figma node 1:286 — Recent transactions. */
export function TransactionsCard({
  title = "Recent transactions",
  rows,
  expanded,
  onToggleExpanded,
  query,
  hiddenCount,
}: {
  title?: string
  rows: Transaction[]
  expanded: boolean
  onToggleExpanded: () => void
  query: string
  hiddenCount: number
}) {
  return (
    <section
      aria-labelledby="transactions-title"
      className="sn-enter flex w-full flex-col overflow-hidden rounded-card bg-surface shadow-card"
      style={{ animationDelay: "220ms" }}
    >
      <div className="flex items-center justify-between gap-3 p-4">
        <h2
          id="transactions-title"
          className="flex min-w-0 flex-col gap-1 text-base leading-[22px] font-semibold text-fg sm:flex-row sm:items-baseline sm:gap-2"
        >
          <span className="whitespace-nowrap">{title}</span>
          {query && (
            <span className="truncate text-sm font-medium text-fg-muted">
              <span className="hidden sm:inline">· </span>
              {rows.length} match{rows.length === 1 ? "" : "es"} for “{query}”
            </span>
          )}
        </h2>
        <Button
          className="rounded-md"
          aria-expanded={expanded}
          aria-controls="transactions-table transactions-list"
          onClick={onToggleExpanded}
          disabled={!expanded && hiddenCount === 0}
        >
          <span className="flex items-center gap-1">
            <span className="px-[2px] leading-none font-medium">{expanded ? "Show less" : "View all"}</span>
            <Icon
              name="chevron-right"
              className={cn(
                "transition-transform duration-(--duration-base) ease-out-strong",
                expanded && "rotate-90"
              )}
            />
          </span>
        </Button>
      </div>

      {/* Phones: stacked list — five columns don't fit, so the row becomes
          "name ··· amount / date · category · method". */}
      <ul id="transactions-list" className="flex flex-col border-t border-line md:hidden">
        {rows.length === 0 ? (
          <li className="px-4 py-10 text-center text-sm font-medium text-fg-muted">No transactions match “{query}”.</li>
        ) : (
          rows.map((t, i) => (
            <li
              key={t.id}
              className={cn(
                "flex items-center justify-between gap-3 border-b border-line px-4 py-3 last:border-b-0",
                i >= 5 && "sn-enter"
              )}
              style={i >= 5 ? { animationDelay: `${(i - 5) * 30}ms` } : undefined}
            >
              <div className="flex min-w-0 flex-col gap-1.5">
                <span className="truncate text-sm font-medium text-fg">{t.name}</span>
                <span className="truncate text-xs font-medium text-fg-muted">
                  {formatDate(parseIsoDate(t.date))} · {t.category} · {t.method}
                </span>
              </div>
              <span
                className={cn(
                  "shrink-0 text-sm font-medium tabular-nums",
                  t.amount > 0 ? "text-positive" : "text-fg"
                )}
              >
                {formatSignedUsd(t.amount)}
              </span>
            </li>
          ))
        )}
      </ul>

      <div className="hidden md:block">
      <Table id="transactions-table" className="table-fixed border-separate border-spacing-0 text-sm">
        <TableHeader className="[&_tr]:border-b-0">
          <TableRow className="border-0 bg-sunken hover:bg-sunken">
            {COLS.map((c, i) => (
              <TableHead
                key={c.key}
                scope="col"
                className={cn(
                  "h-[46px] border-y border-line px-4 py-0 text-sm leading-none font-medium text-fg-subtle",
                  i < COLS.length - 1 && "border-r border-line",
                  c.className
                )}
              >
                {c.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={COLS.length} className="h-[136px] p-4 text-center text-sm font-medium text-fg-muted">
                No transactions match “{query}”.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((t, i) => (
              <TableRow
                key={t.id}
                className={cn(
                  "group/row border-0 transition-colors duration-(--duration-press)",
                  "hover:bg-transparent [@media(hover:hover)]:hover:bg-hover",
                  i >= 5 && "sn-enter"
                )}
                style={i >= 5 ? { animationDelay: `${(i - 5) * 30}ms` } : undefined}
              >
                <Cell className="text-fg-muted">{formatDate(parseIsoDate(t.date))}</Cell>
                <Cell className="text-fg">{t.name}</Cell>
                <Cell className="text-fg-muted">{t.category}</Cell>
                <Cell className="text-fg-muted">{t.method}</Cell>
                <Cell last className={cn("text-right tabular-nums", t.amount > 0 ? "text-positive" : "text-fg")}>
                  {formatSignedUsd(t.amount)}
                </Cell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      </div>
    </section>
  )
}

function Cell({ children, className, last }: { children: React.ReactNode; className?: string; last?: boolean }) {
  return (
    <TableCell
      className={cn(
        "h-[45px] truncate border-b border-line px-4 py-0 text-sm leading-none font-medium group-last/row:h-[44px] group-last/row:border-b-0",
        !last && "border-r border-line",
        className
      )}
    >
      {children}
    </TableCell>
  )
}
