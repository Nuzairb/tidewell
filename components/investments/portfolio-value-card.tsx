import { BalanceChart } from "@/components/accounts/balance-chart"
import { CardAction } from "@/components/dashboard/card-action"
import { SectionCard } from "@/components/dashboard/section-card"
import { ACCOUNT, PORTFOLIO } from "@/components/investments/portfolio"
import { formatBalance, formatSignedUsd } from "@/lib/format"
import { cn } from "@/lib/utils"

/** Six-month value line, then how Jan 1 became today: start + contributions + market gain. */
export function PortfolioValueCard({ className }: { className?: string }) {
  const rows = [
    { label: "Value on Jan 1", value: formatBalance(PORTFOLIO.startOfYear), className: "text-fg" },
    { label: "Contributions", value: formatSignedUsd(PORTFOLIO.contributions), className: "text-positive" },
    { label: "Market gain", value: formatSignedUsd(PORTFOLIO.gain), className: "text-positive" },
    { label: "Value today", value: formatBalance(PORTFOLIO.value), className: "text-fg-numeric font-semibold" },
  ]

  return (
    <SectionCard
      id="portfolio-value"
      title="Portfolio value"
      action={<CardAction label="Statements" feature="Statements" />}
      delay={160}
      className={className}
    >
      <div className="flex flex-col gap-5 px-4 pb-5">
        <div className="flex flex-col gap-2.5">
          <p className="text-sm font-medium tracking-label text-fg-muted">
            {ACCOUNT.institution} {ACCOUNT.name} ••{ACCOUNT.mask}
          </p>
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <span className="font-mono text-xl font-semibold text-fg-numeric tabular-nums sm:text-2xl">
              {formatBalance(ACCOUNT.balance)}
            </span>
            <span className="text-sm font-medium tracking-label">
              <span className={ACCOUNT.monthChange > 0 ? "text-positive" : "text-negative"}>
                {formatSignedUsd(ACCOUNT.monthChange)}{" "}
              </span>
              <span className="text-fg-muted">this month</span>
            </span>
          </p>
        </div>
        <BalanceChart values={ACCOUNT.history} label="Portfolio value" />
      </div>

      <dl className="mt-auto grid border-t border-line sm:grid-cols-2">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={cn(
              "flex h-[45px] items-center justify-between gap-3 border-b border-line px-4",
              "sm:odd:border-r sm:[&:nth-last-child(-n+2)]:border-b-0",
              i === rows.length - 1 && "border-b-0"
            )}
          >
            <dt className="truncate text-sm font-medium text-fg-muted">{row.label}</dt>
            <dd className={cn("shrink-0 text-sm font-medium tabular-nums", row.className)}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </SectionCard>
  )
}
