"use client"

import { useMemo, useRef, useState } from "react"
import { StatCards } from "@/components/dashboard/stat-cards"
import { PageContent } from "@/components/dashboard/app-shell"
import { PageHeader } from "@/components/dashboard/page-header"
import { TransactionsCard } from "@/components/dashboard/transactions-card"
import { TagDetail } from "@/components/tracking/tag-detail"
import { TagList } from "@/components/tracking/tag-list"
import { TAG_SUMMARIES, TRACKING_STATS } from "@/components/tracking/tag-stats"
import { TAGGED_TRANSACTIONS } from "@/lib/data/tracking"
import { BREAKPOINTS, useMediaQuery } from "@/lib/use-media-query"

const PREVIEW_ROWS = 5

/** Tracking — tags that follow a trip, a project or a client across categories and accounts. */
export function TrackingView() {
  const isDesktop = useMediaQuery(BREAKPOINTS.lg)
  const detailRef = useRef<HTMLDivElement>(null)
  const [selectedId, setSelectedId] = useState(TAG_SUMMARIES[0].id)
  const [query, setQuery] = useState("")
  const [expanded, setExpanded] = useState(false)

  const tags = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return TAG_SUMMARIES
    return TAG_SUMMARIES.filter((t) => [t.name, t.note].some((v) => v.toLowerCase().includes(q)))
  }, [query])

  // the detail keeps showing the selected tag even when the search hides its row
  const tag = TAG_SUMMARIES.find((t) => t.id === selectedId) ?? TAG_SUMMARIES[0]
  const rows = TAGGED_TRANSACTIONS.filter((t) => t.tag === selectedId)
  const visible = expanded ? rows : rows.slice(0, PREVIEW_ROWS)

  const select = (id: string) => {
    setSelectedId(id)
    setExpanded(false)
    if (!isDesktop) detailRef.current?.scrollIntoView({ block: "start" })
  }

  return (
    <>
      <PageHeader
        searchLabel="Search tags"
        title="Tracking"
        subtitle="Trips, projects and clients, across every category."
        query={query}
        onQueryChange={setQuery}
      />
      <PageContent>
        <StatCards items={TRACKING_STATS} label="Tracking summary" />
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <TagList tags={tags} query={query} selectedId={selectedId} onSelect={select} />
          <div ref={detailRef} className="flex scroll-mt-4 flex-col">
            <TagDetail tag={tag} className="flex-1" />
          </div>
        </div>
        <TransactionsCard
          title="Tagged transactions"
          rows={visible}
          expanded={expanded}
          onToggleExpanded={() => setExpanded((v) => !v)}
          query=""
          hiddenCount={Math.max(0, rows.length - PREVIEW_ROWS)}
        />
      </PageContent>
    </>
  )
}
