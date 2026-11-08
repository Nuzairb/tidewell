"use client"

import type { CategoryRow } from "@/components/budget/budget-math"
import { FixedTag, LeftValue, LimitValue, type LimitEditing } from "@/components/budget/category-cells"
import { Button } from "@/components/ui/button"
import { Meter } from "@/components/ui/meter"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatBalance } from "@/lib/format"
import { cn } from "@/lib/utils"

const COLS = [
  { key: "category", label: "Category", className: "w-[220px]" },
  { key: "used", label: "Used", className: "" },
  { key: "spent", label: "Spent", className: "w-[140px] text-right" },
  { key: "limit", label: "Budget", className: "w-[140px] text-right" },
  { key: "left", label: "Remaining", className: "w-[160px] text-right" },
] as const

/** Every category for the month: spent against limit, with an edit mode for the limits. */
export function BudgetCategories({
  monthLabel,
  rows,
  query,
  edit,
  canSave,
  onEdit,
  onCancel,
  onSave,
}: {
  monthLabel: string
  rows: CategoryRow[]
  query: string
  edit: LimitEditing
  canSave: boolean
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
}) {
  return (
    <section
      aria-labelledby="budget-categories-title"
      className="sn-enter flex w-full min-w-0 flex-col overflow-hidden rounded-card bg-surface shadow-card"
      style={{ animationDelay: "80ms" }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (canSave) onSave()
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape" && edit.editing) onCancel()
        }}
      >
        <div className="flex min-h-[62px] items-center justify-between gap-3 p-4">
          <h2
            id="budget-categories-title"
            className="flex min-w-0 flex-col gap-1 text-base leading-[22px] font-semibold text-fg sm:flex-row sm:items-baseline sm:gap-2"
          >
            <span className="whitespace-nowrap">Categories</span>
            {query && (
              <span className="truncate text-sm font-medium text-fg-muted">
                <span className="hidden sm:inline">· </span>
                {rows.length} match{rows.length === 1 ? "" : "es"} for “{query}”
              </span>
            )}
          </h2>
          {edit.editing ? (
            <div className="flex shrink-0 items-center gap-2">
              <Button type="button" className="rounded-md" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="default" className="rounded-md" disabled={!canSave}>
                Save
              </Button>
            </div>
          ) : (
            <Button type="button" className="rounded-md" onClick={onEdit}>
              <span className="px-[2px] leading-none font-medium">Edit budgets</span>
            </Button>
          )}
        </div>

        {rows.length === 0 ? (
          <p className="border-t border-line px-4 py-10 text-center text-sm font-medium text-fg-muted">
            No categories match “{query}”.
          </p>
        ) : (
          <>
            <CategoryList rows={rows} edit={edit} />
            <CategoryTable rows={rows} edit={edit} />
          </>
        )}

        {edit.editing && (
          <div
            role="status"
            className="flex min-h-[45px] items-center justify-between gap-3 border-t border-line bg-sunken px-4 py-2.5"
          >
            <span className="text-xs leading-[1.4] font-medium text-fg-muted">
              {canSave
                ? `Editing ${monthLabel} limits. Totals update as you type.`
                : "Limits must be whole dollar amounts."}
            </span>
          </div>
        )}
      </form>
    </section>
  )
}

/** Phones: "name ··· spent / limit", meter, then what's left. */
function CategoryList({ rows, edit }: { rows: CategoryRow[]; edit: LimitEditing }) {
  return (
    <ul className="flex flex-col border-t border-line md:hidden">
      {rows.map((row) => (
        <li key={row.id} className="flex flex-col gap-2.5 border-b border-line px-4 py-3.5 last:border-b-0">
          <div className="flex min-h-[26px] items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-2">
              <span className="truncate text-sm font-medium text-fg">{row.category}</span>
              {row.fixed && <FixedTag />}
            </span>
            <span className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-fg-muted tabular-nums">
              <span className={cn(row.warn ? "text-negative" : "text-fg")}>{formatBalance(row.spent)}</span>
              {edit.editing && !row.fixed ? "of" : "/"}
              <LimitValue row={row} edit={edit} />
            </span>
          </div>
          <Meter value={row.used} tone={row.warn ? "negative" : "accent"} label={`${row.category} budget used`} />
          <div className="flex items-center justify-between gap-3 text-xs font-medium text-fg-muted tabular-nums">
            <LeftValue row={row} />
            <span>{Math.round(row.used * 100)}%</span>
          </div>
        </li>
      ))}
    </ul>
  )
}

function CategoryTable({ rows, edit }: { rows: CategoryRow[]; edit: LimitEditing }) {
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
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              className="group/row border-0 transition-colors duration-(--duration-press) hover:bg-transparent [@media(hover:hover)]:hover:bg-hover"
            >
              <Cell>
                <span className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-fg">{row.category}</span>
                  {row.fixed && <FixedTag />}
                </span>
              </Cell>
              <Cell>
                <span className="flex items-center gap-3">
                  <Meter
                    value={row.used}
                    tone={row.warn ? "negative" : "accent"}
                    label={`${row.category} budget used`}
                    className="flex-1"
                  />
                  <span className="w-10 shrink-0 text-right text-fg-muted tabular-nums">
                    {Math.round(row.used * 100)}%
                  </span>
                </span>
              </Cell>
              <Cell className={cn("text-right tabular-nums", row.warn ? "text-negative" : "text-fg")}>
                {formatBalance(row.spent)}
              </Cell>
              <Cell className="text-right tabular-nums">
                <span className="inline-flex justify-end">
                  <LimitValue row={row} edit={edit} />
                </span>
              </Cell>
              <Cell last className="text-right">
                <LeftValue row={row} />
              </Cell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
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
