"use client"

import { toast } from "sonner"
import { SectionCard } from "@/components/dashboard/section-card"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { ACCOUNT_ACTIVITY, ACCOUNTS, TODAY, TRANSACTIONS } from "@/lib/data"
import { formatDate, parseIsoDate } from "@/lib/format"

/** Spending and in-account activity together: "all transactions" means everything we hold. */
const ROWS = [...TRANSACTIONS, ...ACCOUNT_ACTIVITY]
  .sort((a, b) => b.date.localeCompare(a.date))
  .map((t) => {
    const account = ACCOUNTS.find((a) => a.id === t.account)
    return { ...t, accountName: account ? `${account.institution} ${account.name}` : t.account }
  })

const first = parseIsoDate(ROWS.at(-1)!.date)
const last = parseIsoDate(ROWS[0].date)
// local date parts: toISOString() would shift a midnight date across the UTC line
const stamp = [TODAY.getFullYear(), TODAY.getMonth() + 1, TODAY.getDate()]
  .map((n) => String(n).padStart(2, "0"))
  .join("-")

const FORMATS = [
  {
    id: "csv",
    label: "Transactions as CSV",
    description: "Opens in Excel, Numbers or Sheets",
  },
  {
    id: "json",
    label: "Transactions as JSON",
    description: "Includes account ids, for scripts and apps",
  },
] as const

type Format = (typeof FORMATS)[number]["id"]

function toCsv() {
  const header = ["Date", "Transaction", "Category", "Payment Method", "Account", "Amount"]
  const esc = (v: string | number) => `"${String(v).replaceAll('"', '""')}"`
  return [header, ...ROWS.map((r) => [r.date, r.name, r.category, r.method, r.accountName, r.amount.toFixed(2)])]
    .map((line) => line.map(esc).join(","))
    .join("\n")
}

function toJson() {
  const transactions = ROWS.map(({ id, date, name, category, method, amount, account, accountName }) => ({
    id,
    date,
    name,
    category,
    method,
    amount,
    account,
    accountName,
  }))
  return JSON.stringify({ exportedAt: stamp, transactions }, null, 2)
}

function download(format: Format) {
  const content = format === "csv" ? toCsv() : toJson()
  const type = format === "csv" ? "text/csv;charset=utf-8" : "application/json"
  const url = URL.createObjectURL(new Blob([content], { type }))
  const a = document.createElement("a")
  a.href = url
  a.download = `tidewell-transactions_${stamp}.${format}`
  a.click()
  URL.revokeObjectURL(url)
  toast.success("Export downloaded", {
    description: `${ROWS.length} transactions exported as ${format.toUpperCase()}.`,
  })
}

/** Real in-browser downloads of every transaction. */
export function ExportCard({ className }: { className?: string }) {
  return (
    <SectionCard id="export" title="Export" delay={40} className={className}>
      <ul className="flex flex-col border-t border-line">
        {FORMATS.map((f) => (
          <li key={f.id} className="flex h-[60px] items-center gap-3 border-b border-line px-4 last:border-b-0">
            <span className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="truncate text-sm font-medium text-fg">{f.label}</span>
              <span className="truncate text-xs font-medium text-fg-muted">{f.description}</span>
            </span>
            <Button className="h-[26px] rounded-md px-1.5" aria-label={`Download ${f.label}`} onClick={() => download(f.id)}>
              <Icon name="download-01-alt" />
              <span className="px-[2px] leading-none">{f.id.toUpperCase()}</span>
            </Button>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex h-[45px] items-center justify-between gap-3 border-t border-line bg-sunken px-4">
        <span className="text-sm font-medium text-fg-muted tabular-nums">{ROWS.length} transactions</span>
        <span className="truncate text-sm font-medium text-fg-muted tabular-nums">
          {formatDate(first)} – {formatDate(last)}
        </span>
      </div>
    </SectionCard>
  )
}
