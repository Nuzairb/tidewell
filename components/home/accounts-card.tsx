import { AccountSummary } from "@/components/accounts/account-summary"
import { CardAction } from "@/components/dashboard/card-action"
import { SectionCard } from "@/components/dashboard/section-card"
import { ACCOUNTS, type Account } from "@/lib/data"
import { formatBalance, formatSignedUsd } from "@/lib/format"

const total = ACCOUNTS.reduce((sum, a) => sum + a.balance, 0)
const monthChange = ACCOUNTS.reduce((sum, a) => sum + a.monthChange, 0)

/** Net position across every linked account, then one row per account. */
export function AccountsCard({ className }: { className?: string }) {
  return (
    <SectionCard
      id="accounts"
      title="Accounts"
      action={<CardAction label="Manage" href="/accounts" />}
      delay={0}
      className={className}
    >
      <div className="flex flex-col gap-2.5 px-4 pb-5">
        <p className="text-sm font-medium tracking-label text-fg-muted">Total balance</p>
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
          <span className="font-mono text-xl font-semibold text-fg-numeric tabular-nums sm:text-2xl">
            {formatBalance(total)}
          </span>
          <span className="text-sm font-medium tracking-label">
            <span className="text-positive">{formatSignedUsd(monthChange)} </span>
            <span className="text-fg-muted">this month</span>
          </span>
        </p>
      </div>

      <ul className="flex flex-col border-t border-line">
        {ACCOUNTS.map((account) => (
          <AccountRow key={account.id} account={account} />
        ))}
      </ul>
    </SectionCard>
  )
}

function AccountRow({ account }: { account: Account }) {
  return (
    <li className="flex h-[60px] items-center gap-3 border-b border-line px-4 transition-colors duration-(--duration-press) last:border-b-0 [@media(hover:hover)]:hover:bg-hover">
      <AccountSummary account={account} />
    </li>
  )
}
