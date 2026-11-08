"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { BudgetCategories } from "@/components/budget/budget-categories"
import { BudgetInsights } from "@/components/budget/budget-insights"
import { parseLimit, sortRows, toRow } from "@/components/budget/budget-math"
import { BudgetSummary, monthStatus } from "@/components/budget/budget-summary"
import { MonthSwitcher } from "@/components/budget/month-switcher"
import { PageContent } from "@/components/dashboard/app-shell"
import { PageHeader } from "@/components/dashboard/page-header"
import { BUDGET_MONTHS } from "@/lib/data/budget"

type Limits = Record<string, number>

/**
 * Budget — the month's plan against what actually happened.
 * Edited limits live in state only (per month) and reset on reload.
 */
export function BudgetView() {
  const [monthId, setMonthId] = useState(BUDGET_MONTHS[BUDGET_MONTHS.length - 1].id)
  const [saved, setSaved] = useState<Record<string, Limits>>({})
  const [draft, setDraft] = useState<Record<string, string> | undefined>()
  const [query, setQuery] = useState("")

  const editing = draft !== undefined

  const months = useMemo(
    () =>
      BUDGET_MONTHS.map((m) => ({
        ...m,
        budgets: m.budgets.map((b) => ({ ...b, limit: saved[m.id]?.[b.id] ?? b.limit })),
      })),
    [saved]
  )
  const month = months.find((m) => m.id === monthId) ?? months[months.length - 1]

  // While editing, totals follow the draft; an unparseable field falls back to its saved limit
  const live = useMemo(
    () =>
      draft
        ? month.budgets.map((b) => ({ ...b, limit: b.fixed ? b.limit : (parseLimit(draft[b.id] ?? "") ?? b.limit) }))
        : month.budgets,
    [draft, month.budgets]
  )
  const canSave = !draft || Object.values(draft).every((v) => parseLimit(v) !== undefined)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    // Order by saved limits so rows don't jump around while typing
    const order = sortRows(month.budgets.map(toRow)).map((r) => r.id)
    return live
      .map(toRow)
      .filter((r) => !q || r.category.toLowerCase().includes(q))
      .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
  }, [live, month.budgets, query])

  const startEditing = () =>
    setDraft(Object.fromEntries(month.budgets.filter((b) => !b.fixed).map((b) => [b.id, String(b.limit)])))

  const save = () => {
    if (!draft) return
    const limits = Object.fromEntries(Object.entries(draft).map(([id, v]) => [id, parseLimit(v) ?? 0]))
    setSaved((s) => ({ ...s, [month.id]: { ...s[month.id], ...limits } }))
    setDraft(undefined)
    toast(`${month.label} budgets saved`, {
      id: "budget-saved",
      description: "This is a prototype, so nothing is stored. Reloading resets them.",
    })
  }

  return (
    <>
      <PageHeader
        searchLabel="Search budget categories"
        title="Budget"
        subtitle="Your monthly plan against what you actually spent."
        query={query}
        onQueryChange={setQuery}
      />
      <PageContent>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <MonthSwitcher months={months} value={month.id} onChange={setMonthId} disabled={editing} />
          <p className="text-sm font-medium text-fg-muted">
            {editing ? "Save or cancel to switch months" : monthStatus(month).long}
          </p>
        </div>
        <div className="grid gap-3 sm:gap-4 xl:grid-cols-3">
          <BudgetSummary month={month} budgets={live} className="xl:col-span-2" />
          <BudgetInsights months={months} />
        </div>
        <BudgetCategories
          monthLabel={month.label}
          rows={rows}
          query={query}
          edit={{
            editing,
            draft: draft ?? {},
            onDraftChange: (id, value) => setDraft((d) => d && { ...d, [id]: value }),
          }}
          canSave={canSave}
          onEdit={startEditing}
          onCancel={() => setDraft(undefined)}
          onSave={save}
        />
      </PageContent>
    </>
  )
}
