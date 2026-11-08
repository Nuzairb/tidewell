import { AccountTile } from "@/components/accounts/account-summary"
import { BalanceChart } from "@/components/accounts/balance-chart"
import { CardAction } from "@/components/dashboard/card-action"
import { SectionCard } from "@/components/dashboard/section-card"
import { Meter } from "@/components/ui/meter"
import type { Account } from "@/lib/data"
import { formatBalance, formatSignedUsd, formatUsdWhole } from "@/lib/format"
import { cn } from "@/lib/utils"

/** Above this share of the limit, card utilisation starts to hurt a credit score. */
const UTILISATION_WARNING = 0.3

/** The selected account: balance, six-month trend, credit use, key facts. */
export function AccountDetail({ account, className }: { account: Account; className?: string }) {
  const { name, institution, initials, kind, mask, balance, monthChange, history, facts, creditLimit } = account
  const isCredit = creditLimit !== undefined
  // A card's balance is what you owe, so chart and headline it as a positive amount
  const shown = isCredit ? Math.abs(balance) : balance
  // …and its change is the change in what you owe: going up is bad
  const change = isCredit ? -monthChange : monthChange
  const isGood = isCredit ? change < 0 : change > 0

  return (
    <SectionCard
      id="account-detail"
      title={name}
      action={<CardAction label="Statements" feature="Statements" />}
      delay={200}
      className={className}
    >
      <div className="flex flex-col gap-5 px-4 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-2.5">
            <p className="text-sm font-medium tracking-label text-fg-muted">
              {isCredit ? "Balance owed" : "Current balance"}
            </p>
            <p className="font-mono text-xl font-semibold text-fg-numeric tabular-nums sm:text-2xl">
              {formatBalance(shown)}
            </p>
            <p className="text-sm font-medium tracking-label">
              <span className={isGood ? "text-positive" : "text-negative"}>
                {formatSignedUsd(change)}{" "}
              </span>
              <span className="text-fg-muted">this month</span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="hidden flex-col items-end gap-1.5 sm:flex">
              <span className="text-sm font-medium text-fg">{institution}</span>
              <span className="text-xs font-medium text-fg-muted">
                {kind} ••{mask}
              </span>
            </span>
            <AccountTile initials={initials} />
          </div>
        </div>

        <BalanceChart values={history.map((v) => (isCredit ? Math.abs(v) : v))} label={`${name} balance`} />

        {isCredit && <CreditUse owed={shown} limit={creditLimit} />}
      </div>

      <dl className="mt-auto grid border-t border-line sm:grid-cols-2">
        {facts.map((fact, i) => (
          <div
            key={fact.label}
            className={cn(
              "flex h-[45px] items-center justify-between gap-3 border-b border-line px-4",
              // 2 × 2 on sm+: right column gets a divider, bottom row loses its rule
              "sm:odd:border-r sm:[&:nth-last-child(-n+2)]:border-b-0",
              i === facts.length - 1 && "border-b-0"
            )}
          >
            <dt className="truncate text-sm font-medium text-fg-muted">{fact.label}</dt>
            <dd className="shrink-0 text-sm font-medium text-fg tabular-nums">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </SectionCard>
  )
}

function CreditUse({ owed, limit }: { owed: number; limit: number }) {
  const used = owed / limit
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-fg">Credit used</span>
        <span className="text-sm font-medium text-fg-muted tabular-nums">
          <span className="text-fg">{Math.round(used * 100)}%</span> of {formatUsdWhole(limit)}
        </span>
      </div>
      <Meter value={used} tone={used >= UTILISATION_WARNING ? "negative" : "accent"} label="Credit used" />
    </div>
  )
}
