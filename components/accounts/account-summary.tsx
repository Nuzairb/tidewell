import type { Account } from "@/lib/data"
import { formatBalance, formatSignedUsd } from "@/lib/format"
import { cn } from "@/lib/utils"

/**
 * Initials tile · name over institution/type · balance over month change.
 * The inside of an account row on Home and Accounts.
 */
export function AccountSummary({ account }: { account: Account }) {
  const { name, institution, initials, kind, mask, balance, monthChange } = account
  return (
    <>
      <AccountTile initials={initials} />
      <span className="flex min-w-0 flex-1 flex-col gap-1.5 text-left">
        <span className="truncate text-sm font-medium text-fg">{name}</span>
        <span className="truncate text-xs font-medium text-fg-muted">
          {institution} · {kind} ••{mask}
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="text-sm font-medium text-fg tabular-nums">{formatBalance(balance)}</span>
        <span className={cn("text-xs font-medium tabular-nums", monthChange > 0 ? "text-positive" : "text-fg-muted")}>
          {formatSignedUsd(monthChange)}
        </span>
      </span>
    </>
  )
}

/** Institution initials — same recipe as the profile avatar. */
export function AccountTile({ initials }: { initials: string }) {
  return (
    <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-md bg-avatar shadow-avatar">
      <span className="font-avatar text-sm leading-none font-semibold tracking-[-0.015em] text-fg-accent">
        {initials}
      </span>
    </span>
  )
}
