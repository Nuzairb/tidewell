import type { ReactNode } from "react"
import { CardAction } from "@/components/dashboard/card-action"
import { SectionCard } from "@/components/dashboard/section-card"
import { FundChip } from "@/components/investments/fund-chip"
import { PORTFOLIO, formatPct, formatShare, type HoldingRow } from "@/components/investments/portfolio"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatBalance, formatUsd } from "@/lib/format"
import { cn } from "@/lib/utils"

const sharesFmt = new Intl.NumberFormat("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })

const COLS = [
  { key: "fund", label: "Fund", className: "w-[34%]" },
  { key: "shares", label: "Shares", className: "text-right" },
  { key: "price", label: "Price", className: "text-right" },
  { key: "value", label: "Value", className: "text-right" },
  { key: "allocation", label: "Allocation", className: "text-right" },
  { key: "return", label: "Return YTD", className: "text-right" },
] as const

const returnTone = (pct: number) => (pct >= 0 ? "text-positive" : "text-negative")

/** The four funds: position, price, value, weight and this year's return. Table ≥ md, list below. */
export function HoldingsCard({ rows, query }: { rows: HoldingRow[]; query: string }) {
  const empty = `No funds match “${query}”.`
  return (
    <SectionCard id="holdings" title="Holdings" action={<CardAction label="Trade" feature="Trading" />} delay={200}>
      <ul aria-label="Holdings" className="flex flex-col border-t border-line md:hidden">
        {rows.length === 0 ? (
          <li className="px-4 py-10 text-center text-sm font-medium text-fg-muted">{empty}</li>
        ) : (
          rows.map((h) => (
            <li key={h.ticker} className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-b-0">
              <FundChip index={h.index} />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="truncate text-sm font-medium text-fg">
                  {h.ticker} <span className="text-fg-muted">· {formatShare(h.weight)}</span>
                </span>
                <span className="truncate text-xs font-medium text-fg-muted tabular-nums">
                  {sharesFmt.format(h.shares)} sh @ {formatUsd(h.price)}
                </span>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5 tabular-nums">
                <span className="text-sm font-medium text-fg">{formatBalance(h.value)}</span>
                <span className={cn("text-xs font-medium", returnTone(h.returnYtd))}>{formatPct(h.returnYtd)}</span>
              </div>
            </li>
          ))
        )}
      </ul>

      <div className="hidden md:block">
        <Table className="table-fixed border-separate border-spacing-0 text-sm">
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
              rows.map((h) => (
                <TableRow
                  key={h.ticker}
                  className={cn(
                    "group/row border-0 transition-colors duration-(--duration-press)",
                    "hover:bg-transparent [@media(hover:hover)]:hover:bg-hover"
                  )}
                >
                  <Cell className="h-[60px]">
                    <span className="flex items-center gap-3">
                      <FundChip index={h.index} />
                      <span className="flex min-w-0 flex-col gap-1.5">
                        <span className="truncate text-fg">{h.ticker}</span>
                        <span className="truncate text-xs text-fg-muted">{h.name}</span>
                      </span>
                    </span>
                  </Cell>
                  <Cell className="text-right text-fg-muted tabular-nums">{sharesFmt.format(h.shares)}</Cell>
                  <Cell className="text-right text-fg-muted tabular-nums">{formatUsd(h.price)}</Cell>
                  <Cell className="text-right text-fg tabular-nums">{formatBalance(h.value)}</Cell>
                  <Cell className="text-right text-fg-muted tabular-nums">{formatShare(h.weight)}</Cell>
                  <Cell last className={cn("text-right tabular-nums", returnTone(h.returnYtd))}>
                    {formatPct(h.returnYtd)}
                  </Cell>
                </TableRow>
              ))
            )}
            {!query && <TotalRow />}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  )
}

/** Whole-portfolio line; hidden while searching, since a partial total would mislead. */
function TotalRow() {
  return (
    <TableRow className="group/row border-0 bg-sunken hover:bg-sunken">
      <Cell className="font-semibold text-fg">Total</Cell>
      <Cell className="text-right text-fg-muted">—</Cell>
      <Cell className="text-right text-fg-muted">—</Cell>
      <Cell className="text-right font-semibold text-fg-numeric tabular-nums">{formatBalance(PORTFOLIO.value)}</Cell>
      <Cell className="text-right text-fg-muted tabular-nums">{formatShare(1)}</Cell>
      <Cell last className={cn("text-right tabular-nums", returnTone(PORTFOLIO.returnPct))}>
        {formatPct(PORTFOLIO.returnPct)}
      </Cell>
    </TableRow>
  )
}

function Cell({ children, className, last }: { children: ReactNode; className?: string; last?: boolean }) {
  return (
    <TableCell
      className={cn(
        "h-[45px] truncate border-b border-line px-4 py-0 text-sm leading-none font-medium",
        "group-last/row:border-b-0",
        !last && "border-r border-line",
        className
      )}
    >
      {children}
    </TableCell>
  )
}
