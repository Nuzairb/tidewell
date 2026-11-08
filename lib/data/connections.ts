import { ACCOUNTS, type Account } from "./accounts"

/**
 * Data: bank connections behind ACCOUNTS, plus privacy defaults.
 * Static prototype data — there is NO backend.
 */

export type ConnectionStatus = "connected" | "attention"

export type Connection = {
  id: string
  institution: string
  initials: string
  status: ConnectionStatus
  /** why a connection needs attention */
  issue?: string
  /** "Today, 9:41 AM" — read from the accounts' own "Last synced" fact */
  lastSynced: string
  accounts: Account[]
}

/** Vanguard's last good sync (6:00 AM) is why its sign-in shows as expired. */
const ISSUES: Record<string, string> = {
  Vanguard: "Sign-in expired. Balances are from this morning.",
}

const lastSynced = (account: Account) =>
  account.facts.find((f) => f.label === "Last synced")?.value ?? "Unknown"

export const CONNECTIONS: Connection[] = [...new Set(ACCOUNTS.map((a) => a.institution))].map((institution) => {
  const accounts = ACCOUNTS.filter((a) => a.institution === institution)
  const issue = ISSUES[institution]
  return {
    id: institution.toLowerCase(),
    institution,
    initials: accounts[0].initials,
    status: issue ? "attention" : "connected",
    issue,
    lastSynced: lastSynced(accounts[0]),
    accounts,
  }
})

export type RetentionOption = { id: string; label: string; description: string }

export const RETENTION_OPTIONS: RetentionOption[] = [
  { id: "2y", label: "2 years", description: "Older transactions are deleted every month." },
  { id: "7y", label: "7 years", description: "Long enough for most tax records." },
]

export const DEFAULT_RETENTION = "7y"

export type PrivacySetting = { id: string; label: string; description: string; defaultOn: boolean }

export const PRIVACY_SETTINGS: PrivacySetting[] = [
  {
    id: "usage",
    label: "Share anonymous usage",
    description: "Which screens you open — never amounts or names.",
    defaultOn: false,
  },
  {
    id: "insights",
    label: "Personalised insights",
    description: "Lets Analytics compare your months and merchants.",
    defaultOn: true,
  },
  {
    id: "summary",
    label: "Monthly summary email",
    description: "Totals only, sent on the 1st.",
    defaultOn: true,
  },
]
