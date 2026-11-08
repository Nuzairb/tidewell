"use client"

import { AccountSummary } from "@/components/accounts/account-summary"
import { CardAction } from "@/components/dashboard/card-action"
import { SectionCard } from "@/components/dashboard/section-card"
import { ACCOUNT_GROUPS, ACCOUNTS } from "@/lib/data"
import { formatBalance } from "@/lib/format"
import { cn } from "@/lib/utils"

const groups = ACCOUNT_GROUPS.map((group) => {
  const accounts = ACCOUNTS.filter((a) => a.group === group.id)
  return { ...group, accounts, total: accounts.reduce((sum, a) => sum + a.balance, 0) }
})

/** Every linked account, grouped by type with a subtotal per group. Rows select the detail panel. */
export function AccountList({
  selectedId,
  onSelect,
  className,
}: {
  selectedId: string
  onSelect: (id: string) => void
  className?: string
}) {
  return (
    <SectionCard
      id="account-list"
      title="All accounts"
      action={<CardAction label="Link account" feature="Linking accounts" />}
      delay={160}
      className={className}
    >
      {groups.map((group) => (
        <div key={group.id} role="group" aria-labelledby={`group-${group.id}`}>
          <div className="flex h-9 items-center justify-between gap-3 border-y border-line bg-sunken px-4">
            <span id={`group-${group.id}`} className="text-sm font-medium text-fg-subtle">
              {group.label}
            </span>
            <span className="text-sm font-medium text-fg-muted tabular-nums">{formatBalance(group.total)}</span>
          </div>
          <ul className="flex flex-col">
            {group.accounts.map((account) => {
              const selected = account.id === selectedId
              return (
                <li key={account.id} className="border-b border-line last:border-b-0">
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onSelect(account.id)}
                    className={cn(
                      "flex h-[60px] w-full cursor-pointer items-center gap-3 px-4 outline-none",
                      "transition-colors duration-(--duration-press) ease-out-strong",
                      "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--ring-focus)",
                      selected ? "bg-nav-active" : "[@media(hover:hover)]:hover:bg-hover"
                    )}
                  >
                    <AccountSummary account={account} />
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </SectionCard>
  )
}
