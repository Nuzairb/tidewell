"use client"

import { useMemo, useRef, useState } from "react"
import { AccountDetail } from "@/components/accounts/account-detail"
import { AccountList } from "@/components/accounts/account-list"
import { PageContent } from "@/components/dashboard/app-shell"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { PageHeader } from "@/components/dashboard/page-header"
import { TransactionsCard } from "@/components/dashboard/transactions-card"
import { ACCOUNT_ACTIVITY, ACCOUNTS, TRANSACTIONS, type Account, type Kpi } from "@/lib/data"
import { formatBalance, formatSignedUsd } from "@/lib/format"
import { BREAKPOINTS, useMediaQuery } from "@/lib/use-media-query"

const PREVIEW_ROWS = 5

const ACTIVITY = [...TRANSACTIONS, ...ACCOUNT_ACTIVITY].sort((a, b) => b.date.localeCompare(a.date))

const sum = (accounts: Account[], key: "balance" | "monthChange") =>
  accounts.reduce((total, a) => total + a[key], 0)

function summaryKpis(): Kpi[] {
  const cash = ACCOUNTS.filter((a) => a.group === "cash")
  const investments = ACCOUNTS.filter((a) => a.group === "investments")
  const credit = ACCOUNTS.filter((a) => a.group === "credit")
  const investedBefore = sum(investments, "balance") - sum(investments, "monthChange")
  // credit balances are negative; owing more this month is a negative monthChange
  const owedChange = -sum(credit, "monthChange")

  return [
    {
      id: "net-worth",
      label: "Net worth",
      value: formatBalance(sum(ACCOUNTS, "balance")),
      change: formatSignedUsd(sum(ACCOUNTS, "monthChange")),
      context: "this month",
      trend: "up",
      sentiment: "positive",
      icon: "wallet-02",
      action: "Net worth",
    },
    {
      id: "cash",
      label: "Cash",
      value: formatBalance(sum(cash, "balance")),
      change: formatSignedUsd(sum(cash, "monthChange")),
      context: "this month",
      trend: "up",
      sentiment: "positive",
      icon: "coins-swap-01",
      action: "Cash accounts",
    },
    {
      id: "investments",
      label: "Investments",
      value: formatBalance(sum(investments, "balance")),
      change: `+${((sum(investments, "monthChange") / investedBefore) * 100).toFixed(1)}%`,
      context: "this month",
      trend: "up",
      sentiment: "positive",
      icon: "line-chart-up-05",
      action: "Investments",
      href: "/investments",
    },
    {
      id: "credit",
      label: "Credit card debt",
      value: formatBalance(-sum(credit, "balance")),
      change: formatSignedUsd(owedChange),
      context: "this month",
      trend: owedChange > 0 ? "up" : "down",
      sentiment: owedChange > 0 ? "negative" : "positive",
      icon: "credit-card-down",
      action: "Credit cards",
    },
  ]
}

const KPIS = summaryKpis()

/** Accounts — every balance in one place, then a closer look at one account. */
export function AccountsView() {
  const isDesktop = useMediaQuery(BREAKPOINTS.lg)
  const detailRef = useRef<HTMLDivElement>(null)
  const [selectedId, setSelectedId] = useState(ACCOUNTS[0].id)
  const [query, setQuery] = useState("")
  const [expanded, setExpanded] = useState(false)

  const account = ACCOUNTS.find((a) => a.id === selectedId) ?? ACCOUNTS[0]

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ACTIVITY.filter(
      (t) =>
        t.account === selectedId &&
        (!q || [t.name, t.category, t.method].some((v) => v.toLowerCase().includes(q)))
    )
  }, [query, selectedId])

  const visible = expanded || query ? filtered : filtered.slice(0, PREVIEW_ROWS)

  const select = (id: string) => {
    setSelectedId(id)
    setExpanded(false)
    // stacked layout: bring the detail into view instead of leaving it below the fold
    if (!isDesktop) detailRef.current?.scrollIntoView({ block: "start" })
  }

  return (
    <>
      <PageHeader
        title="Accounts"
        subtitle="Every balance, in one place."
        query={query}
        onQueryChange={setQuery}
      />
      <PageContent>
        <KpiCards items={KPIS} label="Accounts summary" />
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <AccountList selectedId={selectedId} onSelect={select} />
          <div ref={detailRef} className="flex scroll-mt-4 flex-col">
            <AccountDetail account={account} className="flex-1" />
          </div>
        </div>
        <TransactionsCard
          title="Account activity"
          rows={visible}
          expanded={expanded}
          onToggleExpanded={() => setExpanded((v) => !v)}
          query={query}
          hiddenCount={Math.max(0, filtered.length - PREVIEW_ROWS)}
        />
      </PageContent>
    </>
  )
}
