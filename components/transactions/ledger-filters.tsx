"use client"

import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type LedgerType = "all" | "income" | "spending"

export type LedgerFilterState = { type: LedgerType; account: string; category: string }

/** "all" is the unfiltered value for every filter. */
export const NO_FILTERS: LedgerFilterState = { type: "all", account: "all", category: "all" }

const TYPES: { value: LedgerType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "income", label: "Income" },
  { value: "spending", label: "Spending" },
]

type Option = { value: string; label: string }

/** Type segmented control · Account · Category · Clear. Filters apply instantly. */
export function LedgerFilters({
  filters,
  onChange,
  accounts,
  categories,
}: {
  filters: LedgerFilterState
  onChange: (f: LedgerFilterState) => void
  accounts: Option[]
  categories: Option[]
}) {
  const active = filters.type !== "all" || filters.account !== "all" || filters.category !== "all"

  return (
    <div role="group" aria-label="Filters" className="flex flex-wrap items-center gap-2">
      <div
        role="group"
        aria-label="Transaction type"
        className="flex h-[30px] items-center gap-0.5 rounded-lg bg-surface p-0.5 shadow-control"
      >
        {TYPES.map((t) => {
          const selected = filters.type === t.value
          return (
            <Button
              key={t.value}
              variant="ghost"
              aria-pressed={selected}
              onClick={() => onChange({ ...filters, type: t.value })}
              className={cn(
                "h-[26px] rounded-md px-2",
                selected &&
                  "bg-nav-active text-fg-accent active:bg-nav-active [@media(hover:hover)]:hover:bg-nav-active [@media(hover:hover)]:hover:text-fg-accent"
              )}
            >
              <span className="px-[2px] leading-none">{t.label}</span>
            </Button>
          )
        })}
      </div>

      <FilterMenu
        label="Account"
        allLabel="All accounts"
        value={filters.account}
        options={accounts}
        onValueChange={(account) => onChange({ ...filters, account })}
      />
      <FilterMenu
        label="Category"
        allLabel="All categories"
        value={filters.category}
        options={categories}
        onValueChange={(category) => onChange({ ...filters, category })}
      />

      {active && (
        <Button variant="link" className="h-[30px] px-1 no-underline" onClick={() => onChange(NO_FILTERS)}>
          Clear filters
        </Button>
      )}
    </div>
  )
}

function FilterMenu({
  label,
  allLabel,
  value,
  options,
  onValueChange,
}: {
  label: string
  allLabel: string
  value: string
  options: Option[]
  onValueChange: (value: string) => void
}) {
  const current = options.find((o) => o.value === value)?.label ?? "All"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button aria-label={`${label}: ${current}`} />}>
        <span className="flex items-center gap-1 px-[2px] leading-none">
          <span className="text-fg-muted">{label}</span>
          <span className="max-w-36 truncate text-fg">{current}</span>
        </span>
        <Icon name="chevron-selector-vertical" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={8} className="w-auto min-w-48">
        <DropdownMenuRadioGroup value={value} onValueChange={(v: string) => onValueChange(v)}>
          <DropdownMenuRadioItem value="all" className="h-[30px] pl-2 font-medium">
            {allLabel}
          </DropdownMenuRadioItem>
          <DropdownMenuSeparator />
          {options.map((o) => (
            <DropdownMenuRadioItem key={o.value} value={o.value} className="h-[30px] pl-2 font-medium">
              {o.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
