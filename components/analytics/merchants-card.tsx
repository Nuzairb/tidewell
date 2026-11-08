"use client"

import type { ReactNode } from "react"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { MerchantSpend } from "@/lib/data/analytics"
import { formatUsd } from "@/lib/format"
import { cn } from "@/lib/utils"

const COLS = [
  { key: "merchant", label: "Merchant", className: "w-[220px]" },
  { key: "category", label: "Category", className: "" },
  { key: "visits", label: "Visits", className: "w-[120px] text-right" },
  { key: "average", label: "Avg. per visit", className: "w-[160px] text-right" },
  { key: "total", label: "Total", className: "w-[160px] text-right" },
] as const

/** Where the money went, merchant by merchant — same table grammar as Recent transactions. */
export function MerchantsCard({
  rows,
  expanded,
  onToggleExpanded,
  query,
  hiddenCount,
}: {
  rows: MerchantSpend[]
  expanded: boolean
  onToggleExpanded: () => void
  query: string
  hiddenCount: number
}) {
  const empty = `No merchants match “${query}”.`
  return (
    <section
      aria-labelledby="merchants-title"
      className="sn-enter flex w-full flex-col overflow-hidden rounded-card bg-surface shadow-card"
      style={{ animationDelay: "320ms" }}
    >
      <div className="flex items-center justify-between gap-3 p-4">
        <h2
          id="merchants-title"
          className="flex min-w-0 flex-col gap-1 text-base leading-[22px] font-semibold text-fg sm:flex-row sm:items-baseline sm:gap-2"
        >
          <span className="whitespace-nowrap">Top merchants</span>
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
          aria-controls="merchants-table merchants-list"
          onClick={onToggleExpanded}
          disabled={!expanded && hiddenCount === 0}
        >
          <span className="flex items-center gap-1">
            <span className="px-[2px] leading-none font-medium">{expanded ? "Show less" : "View all"}</span>
            <Icon
              name="chevron-right"
              className={cn("transition-transform duration-(--duration-base) ease-out-strong", expanded && "rotate-90")}
            />
          </span>
        </Button>
      </div>

      {/* Phones: "merchant ··· total / category · visits" */}
      <ul id="merchants-list" className="flex flex-col border-t border-line md:hidden">
        {rows.length === 0 ? (
          <li className="px-4 py-10 text-center text-sm font-medium text-fg-muted">{empty}</li>
        ) : (
          rows.map((m) => (
            <li key={m.id} className="flex h-[60px] items-center justify-between gap-3 border-b border-line px-4 last:border-b-0">
              <div className="flex min-w-0 flex-col gap-1.5">
                <span className="truncate text-sm font-medium text-fg">{m.merchant}</span>
                <span className="truncate text-xs font-medium text-fg-muted tabular-nums">
                  {m.category} · {m.visits} visit{m.visits === 1 ? "" : "s"}
                </span>
              </div>
              <span className="shrink-0 text-sm font-medium text-fg tabular-nums">{formatUsd(m.total)}</span>
            </li>
          ))
        )}
      </ul>

      <div className="hidden md:block">
        <Table id="merchants-table" className="table-fixed border-separate border-spacing-0 text-sm">
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
                  {empty}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((m) => (
                <TableRow
                  key={m.id}
                  className="group/row border-0 transition-colors duration-(--duration-press) hover:bg-transparent [@media(hover:hover)]:hover:bg-hover"
                >
                  <Cell className="text-fg">{m.merchant}</Cell>
                  <Cell className="text-fg-muted">{m.category}</Cell>
                  <Cell className="text-right text-fg-muted tabular-nums">{m.visits}</Cell>
                  <Cell className="text-right text-fg-muted tabular-nums">{formatUsd(m.total / m.visits)}</Cell>
                  <Cell last className="text-right text-fg tabular-nums">
                    {formatUsd(m.total)}
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

function Cell({ children, className, last }: { children: ReactNode; className?: string; last?: boolean }) {
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
