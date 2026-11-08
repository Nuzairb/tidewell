"use client"

import type { ReactNode } from "react"
import { SectionCard } from "@/components/dashboard/section-card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Transaction } from "@/lib/data"
import { formatDate, formatSignedUsd, parseIsoDate } from "@/lib/format"
import { cn } from "@/lib/utils"

export type LedgerRow = Transaction & { accountName: string }

type MonthGroup = { key: string; label: string; total: number; rows: LedgerRow[] }

const COLS = [
  { key: "date", label: "Date", className: "w-[150px]" },
  { key: "name", label: "Transaction", className: "w-[220px] lg:w-[260px]" },
  { key: "category", label: "Category", className: "" },
  { key: "account", label: "Account", className: "" },
  { key: "amount", label: "Amount", className: "w-[140px] text-right" },
] as const

const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" })

/** Rows arrive newest first, so months come out newest first too. */
function groupByMonth(rows: LedgerRow[]): MonthGroup[] {
  const groups: MonthGroup[] = []
  for (const row of rows) {
    const key = row.date.slice(0, 7)
    let group = groups.at(-1)
    if (group?.key !== key) {
      group = { key, label: monthLabel.format(parseIsoDate(row.date)), total: 0, rows: [] }
      groups.push(group)
    }
    group.rows.push(row)
    group.total += row.amount
  }
  return groups
}

const amountClass = (n: number) => (n > 0 ? "text-positive" : "text-fg")

/** The full ledger, grouped by month with each month's net on a sunken header row. */
export function LedgerCard({ rows, onClear }: { rows: LedgerRow[]; onClear: () => void }) {
  const groups = groupByMonth(rows)

  return (
    <SectionCard
      id="ledger"
      title="All transactions"
      delay={40}
      action={
        <span aria-live="polite" className="shrink-0 text-sm font-medium text-fg-muted tabular-nums">
          {rows.length} {rows.length === 1 ? "transaction" : "transactions"}
        </span>
      }
    >
      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-3 border-t border-line px-4 py-10 text-center">
          <p className="text-sm font-medium text-fg-muted">No transactions match these filters.</p>
          <Button onClick={onClear}>
            <span className="px-[2px]">Clear search and filters</span>
          </Button>
        </div>
      ) : (
        <>
          <LedgerList groups={groups} />
          <LedgerTable groups={groups} />
        </>
      )}
    </SectionCard>
  )
}

/** Phones: five columns don't fit, so a row becomes "name ··· amount / date · category · account". */
function LedgerList({ groups }: { groups: MonthGroup[] }) {
  return (
    <div className="md:hidden">
      {groups.map((group) => (
        <div key={group.key} role="group" aria-labelledby={`ledger-m-${group.key}`}>
          <GroupHeader id={`ledger-m-${group.key}`} group={group} className="border-y" />
          <ul className="flex flex-col">
            {group.rows.map((t) => (
              <li
                key={t.id}
                className="flex h-[60px] items-center justify-between gap-3 border-b border-line px-4 last:border-b-0"
              >
                <div className="flex min-w-0 flex-col gap-1.5">
                  <span className="truncate text-sm font-medium text-fg">{t.name}</span>
                  <span className="truncate text-xs font-medium text-fg-muted">
                    {formatDate(parseIsoDate(t.date))} · {t.category} · {t.accountName}
                  </span>
                </div>
                <span className={cn("shrink-0 text-sm font-medium tabular-nums", amountClass(t.amount))}>
                  {formatSignedUsd(t.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function LedgerTable({ groups }: { groups: MonthGroup[] }) {
  return (
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
        {groups.map((group, gi) => (
          <TableBody key={group.key}>
            <TableRow className="border-0 hover:bg-transparent">
              <TableHead scope="rowgroup" colSpan={COLS.length} className="h-9 p-0">
                <GroupHeader group={group} className={cn("border-b", gi > 0 && "border-t")} />
              </TableHead>
            </TableRow>
            {group.rows.map((t) => (
              <TableRow
                key={t.id}
                className={cn(
                  "group/row border-0 transition-colors duration-(--duration-press)",
                  "hover:bg-transparent [@media(hover:hover)]:hover:bg-hover"
                )}
              >
                <Cell className="text-fg-muted">{formatDate(parseIsoDate(t.date))}</Cell>
                <Cell className="text-fg">{t.name}</Cell>
                <Cell className="text-fg-muted">{t.category}</Cell>
                <Cell className="text-fg-muted">{t.accountName}</Cell>
                <Cell last className={cn("text-right tabular-nums", amountClass(t.amount))}>
                  {formatSignedUsd(t.amount)}
                </Cell>
              </TableRow>
            ))}
          </TableBody>
        ))}
      </Table>
    </div>
  )
}

/** Same sunken group row as the account list: label left, the month's net right. */
function GroupHeader({ id, group, className }: { id?: string; group: MonthGroup; className?: string }) {
  return (
    <div className={cn("flex h-9 items-center justify-between gap-3 border-line bg-sunken px-4", className)}>
      <span id={id} className="text-sm font-medium text-fg-subtle">
        {group.label}
      </span>
      <span className="text-sm font-medium text-fg-muted tabular-nums">
        <span className="sr-only">Net </span>
        {formatSignedUsd(group.total)}
      </span>
    </div>
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
