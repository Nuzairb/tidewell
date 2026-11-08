import type { CategoryRow } from "@/components/budget/budget-math"
import { LimitInput } from "@/components/budget/limit-input"
import { formatBalance, formatUsdWhole } from "@/lib/format"
import { cn } from "@/lib/utils"

/** Edit state passed from the view down to every row. */
export type LimitEditing = {
  editing: boolean
  draft: Record<string, string>
  onDraftChange: (id: string, value: string) => void
}

export function FixedTag() {
  return (
    <span className="flex h-5 shrink-0 items-center rounded-[5px] bg-sunken px-1.5 text-xs leading-none font-medium text-fg-muted shadow-control">
      Fixed
    </span>
  )
}

/** The limit as text, or as a field while editing (fixed costs are never editable). */
export function LimitValue({ row, edit }: { row: CategoryRow; edit: LimitEditing }) {
  if (edit.editing && !row.fixed) {
    return (
      <LimitInput
        category={row.category}
        value={edit.draft[row.id] ?? ""}
        onChange={(value) => edit.onDraftChange(row.id, value)}
      />
    )
  }
  return <span className="text-fg">{formatUsdWhole(row.limit)}</span>
}

/** "$84.00 left" / "$12.40 over" */
export function LeftValue({ row, className }: { row: CategoryRow; className?: string }) {
  const isOver = row.left < 0
  return (
    <span className={cn("tabular-nums", isOver ? "text-negative" : "text-fg", className)}>
      {formatBalance(Math.abs(row.left))}
      <span className="text-fg-muted">{isOver ? " over" : " left"}</span>
    </span>
  )
}
