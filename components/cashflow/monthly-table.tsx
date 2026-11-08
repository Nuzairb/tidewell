import type { ReactNode } from "react"
import { SectionCard } from "@/components/dashboard/section-card"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CASHFLOW_TOTALS, MONTHLY_CASHFLOW } from "@/lib/data/cashflow"
import { formatSignedUsd } from "@/lib/format"
import { cn } from "@/lib/utils"

const COLS = [
  { key: "month", label: "Month", className: "w-[150px]" },
  { key: "income", label: "Income", className: "text-right" },
  { key: "expenses", label: "Expenses", className: "text-right" },
  { key: "net", label: "Net", className: "text-right" },
  { key: "rate", label: "Savings rate", className: "w-[140px] text-right" },
] as const

const longMonth = new Intl.DateTimeFormat("en-US", { month: "long" })
const fullName = (month: number) => longMonth.format(new Date(2026, month, 1))

const rate = (net: number, income: number) => `${Math.round((net / income) * 100)}%`
const signedClass = (n: number) => (n > 0 ? "text-positive" : "text-fg")

const ROWS = MONTHLY_CASHFLOW.map((m, i) => ({ ...m, name: fullName(i) })).reverse()
const TOTAL_RATE = rate(CASHFLOW_TOTALS.net, CASHFLOW_TOTALS.income)

/** Jan → Sep, newest first, with a total row that equals the Reports KPIs. */
export function MonthlyTable() {
  return (
    <SectionCard id="monthly" title="Monthly breakdown" delay={200}>
      {/* Phones: "September ··· net / in · out · rate" */}
      <ul className="flex flex-col border-t border-line md:hidden">
        {ROWS.map((m) => (
          <li key={m.month} className="flex h-[60px] items-center justify-between gap-3 border-b border-line px-4">
            <div className="flex min-w-0 flex-col gap-1.5">
              <span className="truncate text-sm font-medium text-fg">{m.name}</span>
              <span className="truncate text-xs font-medium text-fg-muted tabular-nums">
                {formatSignedUsd(m.income)} · {formatSignedUsd(-m.expenses)} · {rate(m.net, m.income)} saved
              </span>
            </div>
            <span className={cn("shrink-0 text-sm font-medium tabular-nums", signedClass(m.net))}>
              {formatSignedUsd(m.net)}
            </span>
          </li>
        ))}
        <li className="flex h-[60px] items-center justify-between gap-3 bg-sunken px-4">
          <div className="flex min-w-0 flex-col gap-1.5">
            <span className="truncate text-sm font-semibold text-fg">Jan – Sep</span>
            <span className="truncate text-xs font-medium text-fg-muted tabular-nums">
              {formatSignedUsd(CASHFLOW_TOTALS.income)} · {formatSignedUsd(-CASHFLOW_TOTALS.expenses)} ·{" "}
              {TOTAL_RATE} saved
            </span>
          </div>
          <span className="shrink-0 text-sm font-semibold text-fg-numeric tabular-nums">
            {formatSignedUsd(CASHFLOW_TOTALS.net)}
          </span>
        </li>
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
            {ROWS.map((m) => (
              <TableRow
                key={m.month}
                className="border-0 transition-colors duration-(--duration-press) hover:bg-transparent [@media(hover:hover)]:hover:bg-hover"
              >
                <Cell header className="text-fg">
                  {m.name}
                </Cell>
                <Cell className="text-right text-positive">{formatSignedUsd(m.income)}</Cell>
                <Cell className="text-right text-fg">{formatSignedUsd(-m.expenses)}</Cell>
                <Cell className={cn("text-right", signedClass(m.net))}>{formatSignedUsd(m.net)}</Cell>
                <Cell last className="text-right text-fg-muted">
                  {rate(m.net, m.income)}
                </Cell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="border-t-0 bg-sunken font-semibold">
            <TableRow className="border-0 hover:bg-transparent">
              <Cell header footer className="text-fg">
                Total, Jan – Sep
              </Cell>
              <Cell footer className="text-right text-positive">
                {formatSignedUsd(CASHFLOW_TOTALS.income)}
              </Cell>
              <Cell footer className="text-right text-fg">
                {formatSignedUsd(-CASHFLOW_TOTALS.expenses)}
              </Cell>
              <Cell footer className="text-right text-fg-numeric">
                {formatSignedUsd(CASHFLOW_TOTALS.net)}
              </Cell>
              <Cell footer last className="text-right text-fg">
                {TOTAL_RATE}
              </Cell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </SectionCard>
  )
}

function Cell({
  children,
  className,
  last,
  header,
  footer,
}: {
  children: ReactNode
  className?: string
  last?: boolean
  /** the month name labels its row */
  header?: boolean
  /** total row: no bottom rule, it closes the card */
  footer?: boolean
}) {
  const classes = cn(
    "h-[45px] truncate border-line px-4 py-0 text-left text-sm leading-none tabular-nums",
    footer ? "h-[44px] font-semibold" : "border-b font-medium",
    !last && "border-r",
    className
  )
  return header ? (
    <th scope="row" className={cn(classes, "align-middle whitespace-nowrap")}>
      {children}
    </th>
  ) : (
    <TableCell className={classes}>{children}</TableCell>
  )
}
