"use client"

import { AccountTile } from "@/components/accounts/account-summary"
import { CardAction } from "@/components/dashboard/card-action"
import { SectionCard } from "@/components/dashboard/section-card"
import { tagPeriod, type TagSummary } from "@/components/tracking/tag-stats"
import { BUDGET_WARNING } from "@/lib/data"
import { formatSignedUsd, formatUsd, formatUsdWhole } from "@/lib/format"
import { cn } from "@/lib/utils"

/** Every tag, selectable like the Accounts list. */
export function TagList({
  tags,
  query,
  selectedId,
  onSelect,
  className,
}: {
  tags: TagSummary[]
  query: string
  selectedId: string
  onSelect: (id: string) => void
  className?: string
}) {
  return (
    <SectionCard
      id="tag-list"
      title="Tags"
      action={<CardAction label="New tag" feature="New tags" />}
      delay={160}
      className={className}
    >
      {tags.length === 0 ? (
        <p className="border-t border-line px-4 py-10 text-center text-sm font-medium text-fg-muted">
          No tags match “{query}”.
        </p>
      ) : (
        <ul className="flex flex-col border-t border-line">
          {tags.map((tag) => {
            const selected = tag.id === selectedId
            return (
              <li key={tag.id} className="border-b border-line last:border-b-0">
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelect(tag.id)}
                  className={cn(
                    "flex h-[60px] w-full cursor-pointer items-center gap-3 px-4 outline-none",
                    "transition-colors duration-(--duration-press) ease-out-strong",
                    "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--ring-focus)",
                    selected ? "bg-nav-active" : "[@media(hover:hover)]:hover:bg-hover"
                  )}
                >
                  <TagRow tag={tag} />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </SectionCard>
  )
}

function TagRow({ tag }: { tag: TagSummary }) {
  const { name, initials, count, spent, income, net, budget, used } = tag
  const earns = income > 0
  return (
    <>
      <AccountTile initials={initials} />
      <span className="flex min-w-0 flex-1 flex-col gap-1.5 text-left">
        <span className="truncate text-sm font-medium text-fg">{name}</span>
        <span className="truncate text-xs font-medium text-fg-muted tabular-nums">
          {count} transaction{count === 1 ? "" : "s"} · {tagPeriod(tag)}
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1.5">
        <span className={cn("text-sm font-medium tabular-nums", earns && net > 0 ? "text-positive" : "text-fg")}>
          {earns ? formatSignedUsd(net) : formatUsd(spent)}
        </span>
        <span
          className={cn(
            "text-xs font-medium tabular-nums",
            used !== undefined && used >= BUDGET_WARNING ? "text-negative" : "text-fg-muted"
          )}
        >
          {earns ? "profit" : budget ? `of ${formatUsdWhole(budget)}` : "no budget"}
        </span>
      </span>
    </>
  )
}
