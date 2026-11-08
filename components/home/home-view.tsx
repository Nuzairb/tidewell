"use client"

import { useMemo, useState } from "react"
import { PageContent } from "@/components/dashboard/app-shell"
import { PageHeader } from "@/components/dashboard/page-header"
import { TransactionsCard } from "@/components/dashboard/transactions-card"
import { AccountsCard } from "@/components/home/accounts-card"
import { BudgetsCard } from "@/components/home/budgets-card"
import { GoalsCard } from "@/components/home/goals-card"
import { MonthCard } from "@/components/home/month-card"
import { UpcomingCard } from "@/components/home/upcoming-card"
import { TRANSACTIONS, USER } from "@/lib/data"

const PREVIEW_ROWS = 5

/**
 * Home — where your money stands today. Answers, top to bottom:
 * what do I have, how is this month going, what needs attention, what just happened.
 */
export function HomeView() {
  const [query, setQuery] = useState("")
  const [expanded, setExpanded] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return TRANSACTIONS
    return TRANSACTIONS.filter((t) => [t.name, t.category, t.method].some((v) => v.toLowerCase().includes(q)))
  }, [query])

  const visible = expanded || query ? filtered : filtered.slice(0, PREVIEW_ROWS)
  const firstName = USER.name.split(" ")[0]

  return (
    <>
      <PageHeader
        title="Home"
        subtitle={`Welcome back, ${firstName}. Here's where your money stands.`}
        query={query}
        onQueryChange={setQuery}
      />
      <PageContent>
        <div className="grid gap-3 sm:gap-4 xl:grid-cols-3">
          <AccountsCard className="xl:col-span-2" />
          <MonthCard />
        </div>
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
          <BudgetsCard />
          <UpcomingCard />
          <GoalsCard className="md:col-span-2 xl:col-span-1" />
        </div>
        <TransactionsCard
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
