"use client"

import { useState } from "react"
import { toast } from "sonner"
import { AccountTile } from "@/components/accounts/account-summary"
import { SectionCard } from "@/components/dashboard/section-card"
import { Button } from "@/components/ui/button"
import { CONNECTIONS, type Connection } from "@/lib/data/connections"
import { notInPrototype } from "@/lib/prototype"
import { cn } from "@/lib/utils"

/** Long enough to read as work happening; there's no real request behind it. */
const SYNC_MS = 700

const accountCount = (n: number) => `${n} account${n === 1 ? "" : "s"}`

/** Institutions behind the linked accounts. Syncing is simulated locally. */
export function ConnectionsCard({ query, className }: { query: string; className?: string }) {
  const [lastSynced, setLastSynced] = useState<Record<string, string>>({})
  const [syncing, setSyncing] = useState<string[]>([])

  const q = query.trim().toLowerCase()
  const rows = CONNECTIONS.filter(
    (c) => !q || [c.institution, ...c.accounts.map((a) => a.name)].some((v) => v.toLowerCase().includes(q))
  )
  const syncable = CONNECTIONS.filter((c) => c.status === "connected")

  const sync = (targets: Connection[]) => {
    const ids = targets.map((c) => c.id)
    setSyncing((s) => [...s, ...ids])
    setTimeout(() => {
      setSyncing((s) => s.filter((id) => !ids.includes(id)))
      setLastSynced((s) => ({ ...s, ...Object.fromEntries(ids.map((id) => [id, "Just now"])) }))
      const accounts = targets.reduce((n, c) => n + c.accounts.length, 0)
      toast.success(targets.length === 1 ? `${targets[0].institution} synced` : "All connections synced", {
        description: `${accountCount(accounts)} up to date.`,
      })
    }, SYNC_MS)
  }

  return (
    <SectionCard
      id="connections"
      title="Connections"
      action={
        <Button className="rounded-md" disabled={syncing.length > 0} onClick={() => sync(syncable)}>
          <span className="px-[2px] leading-none font-medium">Sync all</span>
        </Button>
      }
      delay={0}
      className={className}
    >
      {rows.length === 0 ? (
        <p className="border-t border-line px-4 py-10 text-center text-sm font-medium text-fg-muted">
          No connections match “{query}”.
        </p>
      ) : (
        <ul className="flex flex-col border-t border-line">
          {rows.map((c) => (
            <ConnectionRow
              key={c.id}
              connection={c}
              lastSynced={lastSynced[c.id] ?? c.lastSynced}
              isSyncing={syncing.includes(c.id)}
              onSync={() => sync([c])}
            />
          ))}
        </ul>
      )}
    </SectionCard>
  )
}

function ConnectionRow({
  connection,
  lastSynced,
  isSyncing,
  onSync,
}: {
  connection: Connection
  lastSynced: string
  isSyncing: boolean
  onSync: () => void
}) {
  const { institution, initials, status, issue, accounts } = connection
  const attention = status === "attention"
  return (
    <li className="flex h-[60px] items-center gap-3 border-b border-line px-4 last:border-b-0">
      <AccountTile initials={initials} />
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="flex min-w-0 items-baseline gap-1.5">
          <span className="truncate text-sm font-medium text-fg">{institution}</span>
          <span className={cn("shrink-0 text-xs font-medium", attention ? "text-negative" : "text-fg-muted")}>
            · {attention ? "Needs attention" : "Connected"}
          </span>
        </span>
        <span className={cn("truncate text-xs font-medium", attention ? "text-negative" : "text-fg-muted")}>
          {attention ? issue : `${accountCount(accounts.length)} · Synced ${lastSynced}`}
        </span>
      </span>
      {attention ? (
        <Button className="h-[26px] rounded-md px-1.5" onClick={() => notInPrototype("Reconnecting banks")}>
          <span className="px-[2px] leading-none">Reconnect</span>
        </Button>
      ) : (
        <Button
          className="h-[26px] rounded-md px-1.5"
          disabled={isSyncing}
          aria-label={`Sync ${institution} now`}
          onClick={onSync}
        >
          <span className="px-[2px] leading-none">
            {isSyncing ? "Syncing…" : "Sync now"}
          </span>
        </Button>
      )}
    </li>
  )
}
