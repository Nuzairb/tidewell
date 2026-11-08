"use client"

import { useMemo, useRef, useState } from "react"
import { PageContent } from "@/components/dashboard/app-shell"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { PageHeader } from "@/components/dashboard/page-header"
import { GoalDetail } from "@/components/goals/goal-detail"
import { GoalList, type GoalRow } from "@/components/goals/goal-list"
import { projectGoal } from "@/components/goals/goal-projection"
import { ACCOUNTS, HISTORY_MONTHS, type Kpi } from "@/lib/data"
import { GOAL_PLANS } from "@/lib/data/goals"
import { formatBalance, formatSignedUsd } from "@/lib/format"
import { BREAKPOINTS, useMediaQuery } from "@/lib/use-media-query"

type Contributions = Record<string, number>

const PLANNED: Contributions = Object.fromEntries(GOAL_PLANS.map((g) => [g.id, g.monthly]))

const sum = (values: number[]) => values.reduce((total, v) => total + v, 0)

const accountName = (id: string) => ACCOUNTS.find((a) => a.id === id)?.name ?? ""

/** Saved and target are fixed; on-track and monthly follow the what-if contributions. */
function goalKpis(rows: GoalRow[], contributions: Contributions): Kpi[] {
  const saved = sum(GOAL_PLANS.map((g) => g.saved))
  const target = sum(GOAL_PLANS.map((g) => g.target))
  const savedThisMonth = sum(GOAL_PLANS.map((g) => g.history.at(-1)! - g.history.at(-2)!))
  const savedFirstMonth = sum(GOAL_PLANS.map((g) => g.history[1] - g.history[0]))
  const monthly = sum(Object.values(contributions))
  const planned = sum(Object.values(PLANNED))
  const isEdited = Object.entries(contributions).some(([id, v]) => v !== PLANNED[id])
  const behind = rows.filter((r) => !r.projection.onTrack)

  return [
    {
      id: "saved",
      label: "Total saved",
      value: formatBalance(saved),
      change: formatSignedUsd(savedThisMonth),
      context: "this month",
      trend: "up",
      sentiment: "positive",
      icon: "wallet-02",
      action: "Accounts",
      href: "/accounts",
    },
    {
      id: "target",
      label: "Total target",
      value: formatBalance(target),
      change: `${Math.round((saved / target) * 100)}%`,
      context: "saved so far",
      trend: "up",
      sentiment: "positive",
      icon: "target-05",
      action: "Targets",
    },
    {
      id: "on-track",
      label: "Goals on track",
      value: `${rows.length - behind.length} of ${rows.length}`,
      change: behind.length ? `${behind.length} behind` : "All",
      context: behind.length ? behind.map((r) => r.goal.name).join(", ") : "on schedule",
      trend: behind.length ? "down" : "up",
      sentiment: behind.length ? "negative" : "positive",
      icon: "line-chart-up-05",
      action: "Projections",
    },
    {
      id: "monthly",
      label: "Monthly contributions",
      value: formatBalance(monthly),
      // at plan, show how saving has stepped up; once edited, the difference from the plan
      change: formatSignedUsd(monthly - (isEdited ? planned : savedFirstMonth)),
      context: isEdited ? "vs your plan" : `since ${HISTORY_MONTHS[1]}`,
      trend: monthly >= planned ? "up" : "down",
      sentiment: monthly >= planned ? "positive" : "negative",
      icon: "coins-swap-01",
      action: "Transfers",
    },
  ]
}

/** Goals — what you're saving for, whether you'll make it, and what it takes. */
export function GoalsView() {
  const isDesktop = useMediaQuery(BREAKPOINTS.lg)
  const detailRef = useRef<HTMLDivElement>(null)
  const [selectedId, setSelectedId] = useState(GOAL_PLANS[0].id)
  const [query, setQuery] = useState("")
  const [contributions, setContributions] = useState(PLANNED)

  const rows = useMemo(
    () => GOAL_PLANS.map((goal) => ({ goal, projection: projectGoal(goal, contributions[goal.id]) })),
    [contributions]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(({ goal }) => [goal.name, accountName(goal.account)].some((v) => v.toLowerCase().includes(q)))
  }, [query, rows])

  const goal = GOAL_PLANS.find((g) => g.id === selectedId) ?? GOAL_PLANS[0]

  const select = (id: string) => {
    setSelectedId(id)
    // stacked layout: bring the detail into view instead of leaving it below the fold
    if (!isDesktop) detailRef.current?.scrollIntoView({ block: "start" })
  }

  return (
    <>
      <PageHeader
        searchLabel="Search goals"
        title="Goals"
        subtitle="What you're saving for, and when you'll get there."
        query={query}
        onQueryChange={setQuery}
      />
      <PageContent>
        <KpiCards items={goalKpis(rows, contributions)} label="Goals summary" />
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <GoalList rows={filtered} query={query} selectedId={selectedId} onSelect={select} />
          <div ref={detailRef} className="flex scroll-mt-4 flex-col">
            <GoalDetail
              goal={goal}
              monthly={contributions[goal.id]}
              onMonthlyChange={(value) => setContributions((c) => ({ ...c, [goal.id]: value }))}
              className="flex-1"
            />
          </div>
        </div>
      </PageContent>
    </>
  )
}
